# diagnostics.diagnostic_orders

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds diagnostic orders records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 27 columns, 18 constraints, 7 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `address_id` | `uuid` | Yes | — | Reference linking this record to addresses | Ensures related business data can be joined and validated | FK → `customer.addresses` (fk_diagnostics_diagnostic_orders_address_id_addresses) |
| `address_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `customer.addresses` (fk_diagnostics_diagnostic_orders_address_id_addresses_numeric); Numeric/public-key pair verification required |
| `address_snapshot` | `jsonb` | Yes | — | Structured address snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `collection_fee` | `numeric(16,2)` | No | `0` | Value of collection fee | Enable pricing, reconciliation or reporting | See exact constraints |
| `collection_type` | `character varying(32)` | No | — | Inferred: stores collection type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_diagnostic_orders_created_by_users) |
| `currency` | `character varying(3)` | No | `'INR'::character varying` | Monetary currency code | Avoid interpreting amounts without a denomination | See exact constraints |
| `discount_total` | `numeric(16,2)` | No | `0` | Value of discount total | Enable pricing, reconciliation or reporting | See exact constraints |
| `grand_total` | `numeric(16,2)` | No | — | Value of grand total | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lab_location_id` | `uuid` | No | — | Reference linking this record to lab locations | Ensures related business data can be joined and validated | FK → `diagnostics.lab_locations` (fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations) |
| `lab_location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_locations` (fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed); Numeric/public-key pair verification required |
| `order_number` | `character varying(64)` | No | — | Inferred: stores order number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689); Numeric/public-key pair verification required |
| `payment_status` | `character varying(32)` | No | — | Inferred: stores payment status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scheduled_end` | `timestamp with time zone` | Yes | — | Inferred: stores scheduled end for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `scheduled_start` | `timestamp with time zone` | Yes | — | Inferred: stores scheduled start for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(20)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `subtotal` | `numeric(16,2)` | No | — | Inferred: stores subtotal for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `tax_total` | `numeric(16,2)` | No | `0` | Value of tax total | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_diagnostic_orders_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_diagnostic_orders_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the diagnostic orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.diagnostic_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_diagnostics_diagnostic_orders_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_diagnostics_diagnostic_orders_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_diagnostics_diagnostic_orders_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lab_location_id` → `diagnostics.lab_locations(id)` via `fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations`; FOREIGN KEY (lab_location_id) REFERENCES diagnostics.lab_locations(id) ON DELETE RESTRICT
- `address_id` → `customer.addresses(id)` via `fk_diagnostics_diagnostic_orders_address_id_addresses`; FOREIGN KEY (address_id) REFERENCES customer.addresses(id) ON DELETE SET NULL
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11`; FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT
- `address_id_internal_id` → `customer.addresses(internal_id)` via `fk_diagnostics_diagnostic_orders_address_id_addresses_numeric`; FOREIGN KEY (address_id_internal_id) REFERENCES customer.addresses(internal_id) ON DELETE SET NULL
- `lab_location_id_internal_id` → `diagnostics.lab_locations(internal_id)` via `fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed`; FOREIGN KEY (lab_location_id_internal_id) REFERENCES diagnostics.lab_locations(internal_id) ON DELETE RESTRICT
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689`; FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT

**Referenced by 10 FK constraints** (sample): `diagnostics.diagnostic_order_items`, `diagnostics.sample_collections`, `diagnostics.samples`, `diagnostics.diagnostic_reports`, `support.tickets`, `diagnostics.diagnostic_order_items`, `diagnostics.diagnostic_reports`, `diagnostics.sample_collections`, `diagnostics.samples`, `support.tickets`.

## diagnostics.diagnostic_orders — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 27 columns, 18 constraints, 7 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_diagnostics_diagnostic_orders_user_id_users` |
| `created_by` | `identity.users` | `fk_diagnostics_diagnostic_orders_created_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_diagnostic_orders_updated_by_users` |
| `lab_location_id` | `diagnostics.lab_locations` | `fk_diagnostics_diagnostic_orders_lab_location_id_lab_locations` |
| `address_id` | `customer.addresses` | `fk_diagnostics_diagnostic_orders_address_id_addresses` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_4a11` |
| `address_id_internal_id` | `customer.addresses` | `fk_diagnostics_diagnostic_orders_address_id_addresses_numeric` |
| `lab_location_id_internal_id` | `diagnostics.lab_locations` | `fk_diagnostics_diagnostic_orders_lab_location_id_lab_lo_e7ed` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_diagnostics_diagnostic_orders_patient_profile_id_pat_0689` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_orders_lab_location` | `CREATE INDEX ix_diagnostics_orders_lab_location ON diagnostics.diagnostic_orders USING btree (lab_location_id)` |
| `ix_diagnostics_orders_patient_time` | `CREATE INDEX ix_diagnostics_orders_patient_time ON diagnostics.diagnostic_orders USING btree (patient_profile_id, created_at)` |
| `ix_diagnostics_orders_status` | `CREATE INDEX ix_diagnostics_orders_status ON diagnostics.diagnostic_orders USING btree (status)` |
| `ix_diagnostics_orders_user` | `CREATE INDEX ix_diagnostics_orders_user ON diagnostics.diagnostic_orders USING btree (user_id)` |
| `pk_diagnostics_diagnostic_orders` | `CREATE UNIQUE INDEX pk_diagnostics_diagnostic_orders ON diagnostics.diagnostic_orders USING btree (internal_id)` |
| `uq_diagnostics_diagnostic_orders_id` | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_orders_id ON diagnostics.diagnostic_orders USING btree (id)` |
| `uq_diagnostics_diagnostic_orders_order_number` | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_orders_order_number ON diagnostics.diagnostic_orders USING btree (order_number)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.diagnostic_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["address_id","address_id_internal_id","customer","addresses"],["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
