# `diagnostics.diagnostic_orders`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds diagnostic orders records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.diagnostic_orders |
| Classification | Transactional |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 27 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 20 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `address_id` | `uuid` | Yes | — | Reference linking this record to addresses | Ensures related business data can be joined and validated | FK → `customer.addresses` via `fk_diagnostics_diagnostic_orders_address_id_addresses` |
| `address_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.addresses` via `fk_diagnostics_diagnostic_orders_address_id_addresses_numeric` |
| `address_snapshot` | `jsonb` | Yes | — | Structured address snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `collection_fee` | `numeric(16,2)` | No | `0` | Value of collection fee | Enable pricing, reconciliation or reporting | Exact constraints below |
| `collection_type` | `character varying(32)` | No | — | Inferred: stores collection type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_orders_created_by_users` |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | Collation: default |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lab_location_id` | `uuid` | No | — | Reference linking this record to lab locations | Ensures related business data can be joined and validated | FK → `diagnostics.lab_locations` via `fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations` |
| `lab_location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_locations` via `fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed` |
| `order_number` | `character varying(64)` | No | — | Inferred: stores order number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689` |
| `payment_status` | `character varying(32)` | No | — | Inferred: stores payment status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scheduled_end` | `timestamp with time zone` | Yes | — | Inferred: stores scheduled end for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `scheduled_start` | `timestamp with time zone` | Yes | — | Inferred: stores scheduled start for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `status` | `character varying(20)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_orders_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_orders_user_id_users` |

## Record lifecycle and users

- **Created:** when the diagnostic orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.diagnostic_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_diagnostic_orders_address_id_addresses | `address_id` | [`customer.addresses`](../../Tables/customer/addresses.md) | `FOREIGN KEY (address_id) REFERENCES customer.addresses(id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_orders_address_id_addresses_numeric | `address_id_internal_id` | [`customer.addresses`](../../Tables/customer/addresses.md) | `FOREIGN KEY (address_id_internal_id) REFERENCES customer.addresses(internal_id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_orders_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed | `lab_location_id_internal_id` | [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | `FOREIGN KEY (lab_location_id_internal_id) REFERENCES diagnostics.lab_locations(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations | `lab_location_id` | [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | `FOREIGN KEY (lab_location_id) REFERENCES diagnostics.lab_locations(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689 | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11 | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_orders_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_orders_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`diagnostics.diagnostic_order_items`](../../Tables/diagnostics/diagnostic_order_items.md) | fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4 | `diagnostic_order_id` | `id` |
| [`diagnostics.diagnostic_order_items`](../../Tables/diagnostics/diagnostic_order_items.md) | fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff | `diagnostic_order_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_378a | `diagnostic_order_id` | `id` |
| [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_64d1 | `diagnostic_order_id_internal_id` | `internal_id` |
| [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | fk_diagnostics_sample_collections_diagnostic_order_id_d_9075 | `diagnostic_order_id` | `id` |
| [`diagnostics.sample_collections`](../../Tables/diagnostics/sample_collections.md) | fk_diagnostics_sample_collections_diagnostic_order_id_d_c953 | `diagnostic_order_id_internal_id` | `internal_id` |
| [`diagnostics.samples`](../../Tables/diagnostics/samples.md) | fk_diagnostics_samples_diagnostic_order_id_diagnostic_o_a6c8 | `diagnostic_order_id_internal_id` | `internal_id` |
| [`diagnostics.samples`](../../Tables/diagnostics/samples.md) | fk_diagnostics_samples_diagnostic_order_id_diagnostic_orders | `diagnostic_order_id` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_diagnostic_order_id_diagnostic_order_e812 | `diagnostic_order_id_internal_id` | `internal_id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_diagnostic_order_id_diagnostic_orders | `diagnostic_order_id` | `id` |

## `diagnostics.diagnostic_orders` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `address_id` | `customer.addresses` | `fk_diagnostics_diagnostic_orders_address_id_addresses` |
| `address_id_internal_id` | `customer.addresses` | `fk_diagnostics_diagnostic_orders_address_id_addresses_numeric` |
| `created_by` | `identity.users` | `fk_diagnostics_diagnostic_orders_created_by_users` |
| `lab_location_id_internal_id` | `diagnostics.lab_locations` | `fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed` |
| `lab_location_id` | `diagnostics.lab_locations` | `fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11` |
| `updated_by` | `identity.users` | `fk_diagnostics_diagnostic_orders_updated_by_users` |
| `user_id` | `identity.users` | `fk_diagnostics_diagnostic_orders_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_diagnostic_orders_diagnosticorderstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['created'::text, 'confirmed'::text, 'collection_scheduled'::text, 'sample_collected'::text, 'sample_received'::text, 'processing'::text, 'partially_reported'::text, 'reported'::text, 'cancelled'::text]))` |
| `ck_diagnostics_diagnostic_orders_finite_numeric_values` | CHECK | `CHECK ((subtotal IS NULL OR (subtotal <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_total IS NULL OR (discount_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_total IS NULL OR (tax_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (collection_fee IS NULL OR (collection_fee <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (grand_total IS NULL OR (grand_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_diagnostics_diagnostic_orders_numeric_pair_address_id` | CHECK | `CHECK ((address_id IS NULL) = (address_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_orders_numeric_pair_lab_location_id` | CHECK | `CHECK ((lab_location_id IS NULL) = (lab_location_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_orders_numeric_pair_patient_p_0d93` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_orders_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_diagnostic_orders_address_id_addresses` | FOREIGN KEY | `FOREIGN KEY (address_id) REFERENCES customer.addresses(id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_orders_address_id_addresses_numeric` | FOREIGN KEY | `FOREIGN KEY (address_id_internal_id) REFERENCES customer.addresses(internal_id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_orders_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed` | FOREIGN KEY | `FOREIGN KEY (lab_location_id_internal_id) REFERENCES diagnostics.lab_locations(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations` | FOREIGN KEY | `FOREIGN KEY (lab_location_id) REFERENCES diagnostics.lab_locations(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_orders_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_orders_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_diagnostic_orders` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_diagnostic_orders_id` | UNIQUE | `UNIQUE (id)` |
| `uq_diagnostics_diagnostic_orders_order_number` | UNIQUE | `UNIQUE (order_number)` |
| `diagnostic_orders_collection_fee_not_null` | NOT NULL | `NOT NULL collection_fee` |
| `diagnostic_orders_collection_type_not_null` | NOT NULL | `NOT NULL collection_type` |
| `diagnostic_orders_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `diagnostic_orders_currency_not_null` | NOT NULL | `NOT NULL currency` |
| `diagnostic_orders_discount_total_not_null` | NOT NULL | `NOT NULL discount_total` |
| `diagnostic_orders_grand_total_not_null` | NOT NULL | `NOT NULL grand_total` |
| `diagnostic_orders_id_not_null` | NOT NULL | `NOT NULL id` |
| `diagnostic_orders_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `diagnostic_orders_lab_location_id_internal_id_not_null` | NOT NULL | `NOT NULL lab_location_id_internal_id` |
| `diagnostic_orders_lab_location_id_not_null` | NOT NULL | `NOT NULL lab_location_id` |
| `diagnostic_orders_order_number_not_null` | NOT NULL | `NOT NULL order_number` |
| `diagnostic_orders_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `diagnostic_orders_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `diagnostic_orders_payment_status_not_null` | NOT NULL | `NOT NULL payment_status` |
| `diagnostic_orders_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `diagnostic_orders_status_not_null` | NOT NULL | `NOT NULL status` |
| `diagnostic_orders_subtotal_not_null` | NOT NULL | `NOT NULL subtotal` |
| `diagnostic_orders_tax_total_not_null` | NOT NULL | `NOT NULL tax_total` |
| `diagnostic_orders_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `diagnostic_orders_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_orders_lab_location` | btree | `(lab_location_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_orders_lab_location ON diagnostics.diagnostic_orders USING btree (lab_location_id)` |
| `ix_diagnostics_orders_patient_time` | btree | `(patient_profile_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_orders_patient_time ON diagnostics.diagnostic_orders USING btree (patient_profile_id, created_at)` |
| `ix_diagnostics_orders_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_orders_status ON diagnostics.diagnostic_orders USING btree (status)` |
| `ix_diagnostics_orders_user` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_orders_user ON diagnostics.diagnostic_orders USING btree (user_id)` |
| `pk_diagnostics_diagnostic_orders` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_diagnostic_orders ON diagnostics.diagnostic_orders USING btree (internal_id)` |
| `uq_diagnostics_diagnostic_orders_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_orders_id ON diagnostics.diagnostic_orders USING btree (id)` |
| `uq_diagnostics_diagnostic_orders_order_number` | btree | `(order_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_orders_order_number ON diagnostics.diagnostic_orders USING btree (order_number)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.diagnostic_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
