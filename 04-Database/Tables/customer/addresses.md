# customer.addresses

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds addresses records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 30 columns, 12 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `city` | `character varying(100)` | No | — | Inferred: stores city for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `country_code` | `character varying(2)` | No | `'IN'::character varying` | Code for country | Link to controlled business classification or an external reference | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_addresses_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_addresses_deleted_by_users) |
| `district` | `character varying(100)` | Yes | — | Inferred: stores district for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `label` | `character varying(64)` | Yes | — | Inferred: stores label for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `landmark` | `character varying(255)` | Yes | — | Inferred: stores landmark for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `latitude` | `numeric(10,7)` | Yes | — | Inferred: stores latitude for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `line1` | `character varying(255)` | No | — | Inferred: stores line1 for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `line2` | `character varying(255)` | Yes | — | Inferred: stores line2 for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `locality` | `character varying(150)` | Yes | — | Inferred: stores locality for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `longitude` | `numeric(10,7)` | Yes | — | Inferred: stores longitude for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `postal_code` | `character varying(16)` | No | — | Code for postal | Link to controlled business classification or an external reference | See exact constraints |
| `recipient_name` | `character varying(150)` | No | — | Inferred: stores recipient name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `recipient_phone` | `character varying(32)` | No | — | Inferred: stores recipient phone for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `state` | `character varying(100)` | No | — | Inferred: stores state for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `state_code` | `character varying(8)` | Yes | — | Code for state | Link to controlled business classification or an external reference | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_addresses_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_customer_addresses_user_id_users) |
| `validated_at` | `timestamp with time zone` | Yes | — | Time of validated | Support chronology, deadlines or audit evidence | See exact constraints |
| `validation_provider` | `character varying(64)` | Yes | — | Inferred: stores validation provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `validation_status` | `character varying(32)` | No | `'unverified'::character varying` | Inferred: stores validation status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the addresses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.addresses` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_customer_addresses_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_customer_addresses_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_customer_addresses_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_customer_addresses_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 6 FK constraints** (sample): `customer.profiles`, `commerce.checkouts`, `diagnostics.diagnostic_orders`, `commerce.checkouts`, `customer.profiles`, `diagnostics.diagnostic_orders`.

## customer.addresses — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 30 columns, 12 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_customer_addresses_user_id_users` |
| `created_by` | `identity.users` | `fk_customer_addresses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_customer_addresses_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_customer_addresses_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_addresses_finite_numeric_values` | CHECK | `CHECK ((latitude IS NULL OR (latitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (longitude IS NULL OR (longitude <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_customer_addresses_latitude_range` | CHECK | `CHECK (latitude IS NULL OR latitude >= '-90'::integer::numeric AND latitude <= 90::numeric)` |
| `ck_customer_addresses_longitude_range` | CHECK | `CHECK (longitude IS NULL OR longitude >= '-180'::integer::numeric AND longitude <= 180::numeric)` |
| `ck_customer_addresses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_customer_addresses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_addresses_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_addresses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_addresses_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_customer_addresses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_addresses_id` | UNIQUE | `UNIQUE (id)` |
| `uq_numeric_customer_addresses_internal_id_user_id` | UNIQUE | `UNIQUE (internal_id, user_id)` |
| `uq_scope_customer_addresses_user_id` | UNIQUE | `UNIQUE (id, user_id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_customer_addresses_postal_code` | `CREATE INDEX ix_customer_addresses_postal_code ON customer.addresses USING btree (postal_code)` |
| `ix_customer_addresses_user_id` | `CREATE INDEX ix_customer_addresses_user_id ON customer.addresses USING btree (user_id)` |
| `pk_customer_addresses` | `CREATE UNIQUE INDEX pk_customer_addresses ON customer.addresses USING btree (internal_id)` |
| `uq_customer_addresses_id` | `CREATE UNIQUE INDEX uq_customer_addresses_id ON customer.addresses USING btree (id)` |
| `uq_numeric_customer_addresses_internal_id_user_id` | `CREATE UNIQUE INDEX uq_numeric_customer_addresses_internal_id_user_id ON customer.addresses USING btree (internal_id, user_id)` |
| `uq_scope_customer_addresses_user_id` | `CREATE UNIQUE INDEX uq_scope_customer_addresses_user_id ON customer.addresses USING btree (id, user_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.addresses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.addresses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.addresses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
