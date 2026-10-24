# Validated database objects

Generated from [Schema-Catalog.json](Schema-Catalog.json) after fresh installation of the [standalone SQL](../pharmville-database/pharmville_schema.sql). SQL is authoritative. These are effective objects, not historical migration fragments. SQL capability grants are separate from proposed module write ownership; no login identity or role membership is provisioned.

## Complete catalog inventory

| Category | Effective objects |
| --- | --- |
| collations | 0 |
| columns | 4438 |
| constraints | 3198 |
| default_privileges | 1 |
| domain_constraints | 0 |
| extensions | 2 |
| functions | 56 |
| grants | 24 |
| indexes | 1204 |
| not_null_constraints | 2929 |
| policies | 3 |
| procedures | 0 |
| role_memberships | 0 |
| rules | 0 |
| runtime_roles | 4 |
| schemas | 24 |
| sequences | 265 |
| statistics | 0 |
| table_storage | 266 |
| tables | 266 |
| triggers | 879 |
| types | 0 |
| views | 0 |

PostgreSQL 18 records 2,929 NOT NULL constraints separately from the 3,198 PK/FK/UNIQUE/CHECK constraints. Table/composite types and extension-owned routines/types are implicit supporting objects, not extra application-defined types. Sequence current values and records are excluded. Source namespace inspection found only the 24 application namespaces plus public (no application tables in public). The 1,461 FKs create 5,844 internal triggers in addition to 879 user triggers.

## Extensions

| Extension | Version | Namespace |
| --- | --- | --- |
| `pgcrypto` | 1.4 | public |
| `plpgsql` | 1.0 | pg_catalog |

## Runtime capability roles

These groups are all NOLOGIN/NOINHERIT. Runtime login provisioning and memberships remain an external deployment decision. Installation refuses existing unsafe capability groups instead of weakening them.

| Role | Superuser | Bypass RLS | Login | Inherit | Create DB | Create role | Replication |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `pharmville_customer_api` | No | No | No | No | No | No | No |
| `pharmville_integration_worker` | No | No | No | No | No | No | No |
| `pharmville_reporting_worker` | No | No | No | No | No | No | No |
| `pharmville_staff_api` | No | No | No | No | No | No | No |

## Non-owner grants

PUBLIC routine execution is revoked where recorded; owner access remains implicit. Only the grants below are installed. These do not grant all-table domain access.

| Object kind and identity | Grantee | Privilege | Grant option |
| --- | --- | --- | --- |
| column:commerce.order_items.id | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.internal_id | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.line_total | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.order_id | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.product_id | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.quantity | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.status | pharmville_customer_api | SELECT | No |
| column:commerce.order_items.unit_price | pharmville_customer_api | SELECT | No |
| column:commerce.orders.currency | pharmville_customer_api | SELECT | No |
| column:commerce.orders.grand_total | pharmville_customer_api | SELECT | No |
| column:commerce.orders.id | pharmville_customer_api | SELECT | No |
| column:commerce.orders.internal_id | pharmville_customer_api | SELECT | No |
| column:commerce.orders.order_number | pharmville_customer_api | SELECT | No |
| column:commerce.orders.placed_at | pharmville_customer_api | SELECT | No |
| column:commerce.orders.status | pharmville_customer_api | SELECT | No |
| column:commerce.orders.subtotal | pharmville_customer_api | SELECT | No |
| column:commerce.orders.user_id | pharmville_customer_api | SELECT | No |
| function:platform.authenticated_customer() | pharmville_customer_api | EXECUTE | No |
| function:platform.can_read_warehouse(target_warehouse uuid) | pharmville_staff_api | EXECUTE | No |
| relation:warehouse.stock_balances | pharmville_staff_api | SELECT | No |
| schema:commerce | pharmville_customer_api | USAGE | No |
| schema:platform | pharmville_customer_api | USAGE | No |
| schema:platform | pharmville_staff_api | USAGE | No |
| schema:warehouse | pharmville_staff_api | USAGE | No |

## Default privileges

The recorded installer name identifies the disposable source owner. SQL uses CURRENT_USER so equivalent owner-relative default privileges bind to the real installation identity. An absent PUBLIC EXECUTE grant means default-denied future routine execution. Per-schema revocations that add no distinct catalog row remain represented by effective default privileges and the SQL.

| Namespace / object kind | Exact grantee, privilege, grant-option tuples |
| --- | --- |
| `*.f` | `[["pharmville_blueprint_owner", "EXECUTE", false]]` |

## Row-level security policies

Policies protect only the tables where RLS is enabled; they are additional to application object authorization. Table RLS/force settings are preserved in the full catalog.

| Table / policy | Mode | Roles | Command | USING | WITH CHECK |
| --- | --- | --- | --- | --- | --- |
| `commerce.order_items.customer_own_item` | PERMISSIVE | pharmville_customer_api | SELECT | (EXISTS ( SELECT 1    FROM commerce.orders o   WHERE ((o.id = order_items.order_id) AND (o.user_id = platform.authenticated_customer())))) | None |
| `commerce.orders.customer_own_order` | PERMISSIVE | pharmville_customer_api | SELECT | (user_id = platform.authenticated_customer()) | None |
| `warehouse.stock_balances.staff_warehouse_stock` | PERMISSIVE | pharmville_staff_api | SELECT | platform.can_read_warehouse(warehouse_id) | None |

## Identity sequences

All 265 sequences preserve type, bounds, increment, start, cache, cycle and column dependency. The default/identity columns are documented on the owning table pages. No sequence current value is exported.

| Sequence | Type | Exact generation parameters | Owning table / column | Dependency |
| --- | --- | --- | --- | --- |
| `appointment.appointment_slots_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.appointment_slots.internal_id` | i |
| `appointment.appointment_status_history_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.appointment_status_history.internal_id` | i |
| `appointment.appointments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.appointments.internal_id` | i |
| `appointment.availability_exceptions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.availability_exceptions.internal_id` | i |
| `appointment.availability_rules_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.availability_rules.internal_id` | i |
| `appointment.practitioner_services_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.practitioner_services.internal_id` | i |
| `appointment.service_types_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.service_types.internal_id` | i |
| `appointment.teleconsultation_sessions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.teleconsultation_sessions.internal_id` | i |
| `appointment.waiting_room_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `appointment.waiting_room_events.internal_id` | i |
| `catalog.brands_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.brands.internal_id` | i |
| `catalog.categories_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.categories.internal_id` | i |
| `catalog.commerce_classes_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.commerce_classes.id` | i |
| `catalog.dosage_forms_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.dosage_forms.internal_id` | i |
| `catalog.manufacturers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.manufacturers.internal_id` | i |
| `catalog.product_attributes_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_attributes.internal_id` | i |
| `catalog.product_classification_history_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_classification_history.internal_id` | i |
| `catalog.product_content_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_content.internal_id` | i |
| `catalog.product_identifiers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_identifiers.internal_id` | i |
| `catalog.product_media_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_media.internal_id` | i |
| `catalog.product_regulatory_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_regulatory.internal_id` | i |
| `catalog.product_relationships_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_relationships.internal_id` | i |
| `catalog.product_salts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_salts.internal_id` | i |
| `catalog.product_variants_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.product_variants.internal_id` | i |
| `catalog.products_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.products.internal_id` | i |
| `catalog.salts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.salts.internal_id` | i |
| `catalog.substitution_group_products_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.substitution_group_products.internal_id` | i |
| `catalog.substitution_groups_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.substitution_groups.internal_id` | i |
| `catalog.units_of_measure_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `catalog.units_of_measure.internal_id` | i |
| `clinical.care_episodes_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.care_episodes.internal_id` | i |
| `clinical.consultations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.consultations.internal_id` | i |
| `clinical.diagnoses_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.diagnoses.internal_id` | i |
| `clinical.observations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.observations.internal_id` | i |
| `clinical.order_review_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.order_review_items.internal_id` | i |
| `clinical.order_reviews_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.order_reviews.internal_id` | i |
| `clinical.patient_allergies_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.patient_allergies.internal_id` | i |
| `clinical.patient_conditions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.patient_conditions.internal_id` | i |
| `clinical.patient_medications_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.patient_medications.internal_id` | i |
| `clinical.patient_profiles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.patient_profiles.internal_id` | i |
| `clinical.practitioner_organizations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.practitioner_organizations.internal_id` | i |
| `clinical.practitioner_profiles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.practitioner_profiles.internal_id` | i |
| `clinical.prescription_access_logs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.prescription_access_logs.internal_id` | i |
| `clinical.prescription_documents_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.prescription_documents.internal_id` | i |
| `clinical.prescription_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.prescription_items.internal_id` | i |
| `clinical.prescriptions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.prescriptions.internal_id` | i |
| `clinical.review_reason_codes_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `clinical.review_reason_codes.id` | i |
| `commerce.cancellation_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.cancellation_items.internal_id` | i |
| `commerce.cancellation_reason_codes_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.cancellation_reason_codes.id` | i |
| `commerce.cancellations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.cancellations.internal_id` | i |
| `commerce.cart_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.cart_items.internal_id` | i |
| `commerce.carts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.carts.internal_id` | i |
| `commerce.checkouts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.checkouts.internal_id` | i |
| `commerce.order_allocations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_allocations.internal_id` | i |
| `commerce.order_charges_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_charges.internal_id` | i |
| `commerce.order_discounts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_discounts.internal_id` | i |
| `commerce.order_groups_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_groups.internal_id` | i |
| `commerce.order_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_items.internal_id` | i |
| `commerce.order_revisions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_revisions.internal_id` | i |
| `commerce.order_status_history_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.order_status_history.internal_id` | i |
| `commerce.orders_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.orders.internal_id` | i |
| `commerce.return_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.return_items.internal_id` | i |
| `commerce.return_reason_codes_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.return_reason_codes.id` | i |
| `commerce.returns_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `commerce.returns.internal_id` | i |
| `compliance.adverse_event_reports_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.adverse_event_reports.internal_id` | i |
| `compliance.evidence_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.evidence.internal_id` | i |
| `compliance.legal_holds_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.legal_holds.internal_id` | i |
| `compliance.privacy_requests_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.privacy_requests.internal_id` | i |
| `compliance.product_recalls_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.product_recalls.internal_id` | i |
| `compliance.recall_lots_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.recall_lots.internal_id` | i |
| `compliance.regulatory_authorities_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.regulatory_authorities.internal_id` | i |
| `compliance.regulatory_registrations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `compliance.regulatory_registrations.internal_id` | i |
| `customer.addresses_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.addresses.internal_id` | i |
| `customer.consent_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.consent_events.internal_id` | i |
| `customer.consents_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.consents.internal_id` | i |
| `customer.family_members_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.family_members.internal_id` | i |
| `customer.preferences_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.preferences.internal_id` | i |
| `customer.profiles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.profiles.internal_id` | i |
| `customer.wishlist_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.wishlist_items.internal_id` | i |
| `customer.wishlists_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `customer.wishlists.internal_id` | i |
| `diagnostics.diagnostic_order_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.diagnostic_order_items.internal_id` | i |
| `diagnostics.diagnostic_orders_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.diagnostic_orders.internal_id` | i |
| `diagnostics.diagnostic_reports_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.diagnostic_reports.internal_id` | i |
| `diagnostics.diagnostic_result_values_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.diagnostic_result_values.internal_id` | i |
| `diagnostics.lab_locations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.lab_locations.internal_id` | i |
| `diagnostics.lab_offerings_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.lab_offerings.internal_id` | i |
| `diagnostics.lab_providers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.lab_providers.internal_id` | i |
| `diagnostics.sample_collections_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.sample_collections.internal_id` | i |
| `diagnostics.sample_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.sample_events.internal_id` | i |
| `diagnostics.samples_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.samples.internal_id` | i |
| `diagnostics.test_definitions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.test_definitions.internal_id` | i |
| `diagnostics.test_package_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.test_package_items.internal_id` | i |
| `diagnostics.test_packages_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `diagnostics.test_packages.internal_id` | i |
| `finance.accounts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.accounts.internal_id` | i |
| `finance.credit_notes_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.credit_notes.internal_id` | i |
| `finance.invoice_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.invoice_items.internal_id` | i |
| `finance.invoices_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.invoices.internal_id` | i |
| `finance.journal_entries_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.journal_entries.internal_id` | i |
| `finance.journal_lines_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.journal_lines.internal_id` | i |
| `finance.settlement_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.settlement_items.internal_id` | i |
| `finance.settlement_runs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `finance.settlement_runs.internal_id` | i |
| `fulfillment.fulfillment_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.fulfillment_events.internal_id` | i |
| `fulfillment.fulfillment_order_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.fulfillment_order_items.internal_id` | i |
| `fulfillment.fulfillment_orders_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.fulfillment_orders.internal_id` | i |
| `fulfillment.pack_tasks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.pack_tasks.internal_id` | i |
| `fulfillment.package_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.package_items.internal_id` | i |
| `fulfillment.packages_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.packages.internal_id` | i |
| `fulfillment.pick_task_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.pick_task_items.internal_id` | i |
| `fulfillment.pick_tasks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.pick_tasks.internal_id` | i |
| `fulfillment.picking_wave_orders_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.picking_wave_orders.internal_id` | i |
| `fulfillment.picking_waves_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `fulfillment.picking_waves.internal_id` | i |
| `identity.api_client_secrets_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.api_client_secrets.internal_id` | i |
| `identity.api_clients_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.api_clients.internal_id` | i |
| `identity.login_attempts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.login_attempts.internal_id` | i |
| `identity.mfa_factors_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.mfa_factors.internal_id` | i |
| `identity.otp_challenges_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.otp_challenges.internal_id` | i |
| `identity.password_history_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.password_history.internal_id` | i |
| `identity.permissions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.permissions.internal_id` | i |
| `identity.role_permissions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.role_permissions.internal_id` | i |
| `identity.roles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.roles.internal_id` | i |
| `identity.sessions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.sessions.internal_id` | i |
| `identity.trusted_devices_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.trusted_devices.internal_id` | i |
| `identity.user_profiles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.user_profiles.internal_id` | i |
| `identity.user_roles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `identity.user_roles.internal_id` | i |
| `insurance.claim_documents_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.claim_documents.internal_id` | i |
| `insurance.claim_status_history_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.claim_status_history.internal_id` | i |
| `insurance.claims_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.claims.internal_id` | i |
| `insurance.eligibility_checks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.eligibility_checks.internal_id` | i |
| `insurance.insurers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.insurers.internal_id` | i |
| `insurance.policies_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.policies.internal_id` | i |
| `insurance.policy_members_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.policy_members.internal_id` | i |
| `insurance.tpas_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `insurance.tpas.internal_id` | i |
| `logistics.carrier_accounts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.carrier_accounts.internal_id` | i |
| `logistics.carriers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.carriers.internal_id` | i |
| `logistics.delivery_assignments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_assignments.internal_id` | i |
| `logistics.delivery_attempts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_attempts.internal_id` | i |
| `logistics.delivery_failure_reasons_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_failure_reasons.id` | i |
| `logistics.delivery_location_updates_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_location_updates.internal_id` | i |
| `logistics.delivery_otp_challenges_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_otp_challenges.internal_id` | i |
| `logistics.delivery_routes_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_routes.internal_id` | i |
| `logistics.delivery_slots_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.delivery_slots.internal_id` | i |
| `logistics.ndr_cases_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.ndr_cases.internal_id` | i |
| `logistics.reverse_shipments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.reverse_shipments.internal_id` | i |
| `logistics.rider_shifts_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.rider_shifts.id` | i |
| `logistics.serviceability_rules_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.serviceability_rules.internal_id` | i |
| `logistics.shipment_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.shipment_events.internal_id` | i |
| `logistics.shipments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `logistics.shipments.internal_id` | i |
| `marketplace.commission_plans_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.commission_plans.internal_id` | i |
| `marketplace.seller_commission_assignments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.seller_commission_assignments.internal_id` | i |
| `marketplace.seller_locations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.seller_locations.internal_id` | i |
| `marketplace.seller_product_listings_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.seller_product_listings.internal_id` | i |
| `marketplace.seller_ratings_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.seller_ratings.internal_id` | i |
| `marketplace.seller_service_levels_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.seller_service_levels.internal_id` | i |
| `marketplace.sellers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `marketplace.sellers.internal_id` | i |
| `membership.benefit_usage_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `membership.benefit_usage.internal_id` | i |
| `membership.loyalty_accounts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `membership.loyalty_accounts.internal_id` | i |
| `membership.loyalty_ledger_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `membership.loyalty_ledger.internal_id` | i |
| `membership.plan_benefits_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `membership.plan_benefits.internal_id` | i |
| `membership.plans_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `membership.plans.internal_id` | i |
| `membership.subscriptions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `membership.subscriptions.internal_id` | i |
| `notification.device_endpoints_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.device_endpoints.internal_id` | i |
| `notification.in_app_notifications_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.in_app_notifications.internal_id` | i |
| `notification.message_attachments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.message_attachments.internal_id` | i |
| `notification.message_attempts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.message_attempts.internal_id` | i |
| `notification.messages_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.messages.internal_id` | i |
| `notification.provider_configurations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.provider_configurations.internal_id` | i |
| `notification.provider_webhooks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.provider_webhooks.internal_id` | i |
| `notification.suppressions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.suppressions.internal_id` | i |
| `notification.templates_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.templates.internal_id` | i |
| `notification.user_channel_preferences_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `notification.user_channel_preferences.internal_id` | i |
| `organization.bank_accounts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `organization.bank_accounts.internal_id` | i |
| `organization.departments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `organization.departments.internal_id` | i |
| `organization.licenses_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `organization.licenses.internal_id` | i |
| `organization.locations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `organization.locations.internal_id` | i |
| `organization.memberships_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `organization.memberships.internal_id` | i |
| `organization.organizations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `organization.organizations.internal_id` | i |
| `payment.chargebacks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.chargebacks.internal_id` | i |
| `payment.cod_collections_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.cod_collections.internal_id` | i |
| `payment.customer_payment_methods_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.customer_payment_methods.internal_id` | i |
| `payment.payment_attempts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.payment_attempts.internal_id` | i |
| `payment.payment_intents_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.payment_intents.internal_id` | i |
| `payment.payment_transactions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.payment_transactions.internal_id` | i |
| `payment.payment_webhooks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.payment_webhooks.internal_id` | i |
| `payment.provider_accounts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.provider_accounts.internal_id` | i |
| `payment.reconciliation_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.reconciliation_items.internal_id` | i |
| `payment.reconciliation_runs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.reconciliation_runs.internal_id` | i |
| `payment.refund_allocations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.refund_allocations.internal_id` | i |
| `payment.refund_reason_codes_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.refund_reason_codes.id` | i |
| `payment.refunds_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `payment.refunds.internal_id` | i |
| `platform.application_settings_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.application_settings.internal_id` | i |
| `platform.audit_logs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.audit_logs.internal_id` | i |
| `platform.cms_banners_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.cms_banners.internal_id` | i |
| `platform.cms_page_versions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.cms_page_versions.internal_id` | i |
| `platform.cms_pages_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.cms_pages.internal_id` | i |
| `platform.data_retention_policies_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.data_retention_policies.internal_id` | i |
| `platform.feature_flags_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.feature_flags.internal_id` | i |
| `platform.file_access_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.file_access_events.internal_id` | i |
| `platform.file_access_grants_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.file_access_grants.internal_id` | i |
| `platform.file_objects_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.file_objects.internal_id` | i |
| `platform.file_scan_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.file_scan_events.internal_id` | i |
| `platform.file_upload_sessions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.file_upload_sessions.internal_id` | i |
| `platform.file_variants_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.file_variants.internal_id` | i |
| `platform.idempotency_keys_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.idempotency_keys.internal_id` | i |
| `platform.inbox_messages_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.inbox_messages.internal_id` | i |
| `platform.outbox_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.outbox_events.internal_id` | i |
| `platform.report_definitions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.report_definitions.internal_id` | i |
| `platform.report_runs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.report_runs.internal_id` | i |
| `platform.scheduled_jobs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.scheduled_jobs.internal_id` | i |
| `platform.webhook_deliveries_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.webhook_deliveries.internal_id` | i |
| `platform.webhook_endpoints_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `platform.webhook_endpoints.internal_id` | i |
| `pricing.coupon_codes_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.coupon_codes.internal_id` | i |
| `pricing.price_books_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.price_books.internal_id` | i |
| `pricing.pricing_evaluations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.pricing_evaluations.internal_id` | i |
| `pricing.product_prices_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.product_prices.internal_id` | i |
| `pricing.promotion_redemptions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.promotion_redemptions.internal_id` | i |
| `pricing.promotion_versions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.promotion_versions.internal_id` | i |
| `pricing.promotions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.promotions.internal_id` | i |
| `pricing.tax_rules_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `pricing.tax_rules.internal_id` | i |
| `procurement.goods_receipt_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.goods_receipt_items.internal_id` | i |
| `procurement.goods_receipt_quality_checks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.goods_receipt_quality_checks.internal_id` | i |
| `procurement.goods_receipts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.goods_receipts.internal_id` | i |
| `procurement.purchase_order_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.purchase_order_items.internal_id` | i |
| `procurement.purchase_orders_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.purchase_orders.internal_id` | i |
| `procurement.purchase_requisition_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.purchase_requisition_items.internal_id` | i |
| `procurement.purchase_requisitions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.purchase_requisitions.internal_id` | i |
| `procurement.purchase_return_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.purchase_return_items.internal_id` | i |
| `procurement.purchase_returns_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.purchase_returns.internal_id` | i |
| `procurement.supplier_invoices_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.supplier_invoices.internal_id` | i |
| `procurement.supplier_licenses_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.supplier_licenses.internal_id` | i |
| `procurement.supplier_products_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.supplier_products.internal_id` | i |
| `procurement.suppliers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `procurement.suppliers.internal_id` | i |
| `risk.assessments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `risk.assessments.internal_id` | i |
| `risk.blocklists_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `risk.blocklists.internal_id` | i |
| `risk.cases_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `risk.cases.internal_id` | i |
| `risk.rules_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `risk.rules.internal_id` | i |
| `risk.signals_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `risk.signals.internal_id` | i |
| `search.documents_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `search.documents.internal_id` | i |
| `search.indexing_jobs_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `search.indexing_jobs.internal_id` | i |
| `search.query_events_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `search.query_events.internal_id` | i |
| `search.redirects_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `search.redirects.internal_id` | i |
| `search.synonyms_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `search.synonyms.internal_id` | i |
| `support.sla_policies_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.sla_policies.internal_id` | i |
| `support.ticket_actions_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.ticket_actions.internal_id` | i |
| `support.ticket_attachments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.ticket_attachments.internal_id` | i |
| `support.ticket_messages_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.ticket_messages.internal_id` | i |
| `support.ticket_status_history_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.ticket_status_history.internal_id` | i |
| `support.ticket_tag_assignments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.ticket_tag_assignments.internal_id` | i |
| `support.ticket_tags_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.ticket_tags.internal_id` | i |
| `support.tickets_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `support.tickets.internal_id` | i |
| `warehouse.aisles_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.aisles.internal_id` | i |
| `warehouse.bins_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.bins.internal_id` | i |
| `warehouse.cycle_count_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.cycle_count_items.internal_id` | i |
| `warehouse.cycle_counts_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.cycle_counts.internal_id` | i |
| `warehouse.inventory_adjustment_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.inventory_adjustment_items.internal_id` | i |
| `warehouse.inventory_adjustments_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.inventory_adjustments.internal_id` | i |
| `warehouse.inventory_lots_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.inventory_lots.internal_id` | i |
| `warehouse.racks_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.racks.internal_id` | i |
| `warehouse.replenishment_rules_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.replenishment_rules.internal_id` | i |
| `warehouse.stock_balances_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_balances.internal_id` | i |
| `warehouse.stock_holds_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_holds.internal_id` | i |
| `warehouse.stock_ledger_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_ledger.internal_id` | i |
| `warehouse.stock_movement_reason_codes_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_movement_reason_codes.id` | i |
| `warehouse.stock_reservations_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_reservations.internal_id` | i |
| `warehouse.stock_transfer_items_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_transfer_items.internal_id` | i |
| `warehouse.stock_transfers_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.stock_transfers.internal_id` | i |
| `warehouse.warehouses_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.warehouses.internal_id` | i |
| `warehouse.zones_internal_id_seq` | bigint | start=1; increment=1; max=9223372036854775807; min=1; cache=1; cycle=false | `warehouse.zones.internal_id` | i |

## Functions

All 56 definitions retain volatility, SECURITY DEFINER, search_path and execution behavior. The [table references](README.md#table-reference) document each installed user trigger: O = origin enabled, D = disabled, R = replica, A = always. Helper existence grants no service authorization; function ACLs are recorded above.

### `catalog.apply_classification()`

```sql
CREATE OR REPLACE FUNCTION catalog.apply_classification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 UPDATE catalog.products SET commerce_class=NEW.new_class,commerce_class_version=NEW.version,
   prescription_required=(NEW.new_class='P'), commerce_class_approved_by_user_id=NEW.approved_by_user_id,
   commerce_class_approved_at=NEW.approved_at, updated_at=now(), row_version=row_version+1
 WHERE id=NEW.product_id;
 RETURN NEW;
END $function$
```

### `catalog.approve_classification()`

```sql
CREATE OR REPLACE FUNCTION catalog.approve_classification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE product catalog.products;
BEGIN
 PERFORM platform.require_permission(NEW.approved_by_user_id,'catalog.classify');
 SELECT * INTO STRICT product FROM catalog.products WHERE id=NEW.product_id FOR UPDATE;
 IF NEW.old_class IS DISTINCT FROM product.commerce_class
 OR NEW.version <> product.commerce_class_version + (CASE WHEN product.commerce_class IS NULL THEN 0 ELSE 1 END)
 OR NEW.new_class IS NOT DISTINCT FROM product.commerce_class THEN
   RAISE EXCEPTION 'Stale or unchanged classification decision' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $function$
```

### `catalog.assert_sellable(product_key uuid, requested_quantity numeric)`

```sql
CREATE OR REPLACE FUNCTION catalog.assert_sellable(product_key uuid, requested_quantity numeric)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM catalog.products p JOIN catalog.commerce_classes c ON c.code=p.commerce_class
   WHERE p.id=product_key AND p.status='active' AND NOT p.is_deleted AND c.is_active AND p.product_type NOT IN ('lab_test','service'))
 OR EXISTS(SELECT 1 FROM catalog.product_regulatory r WHERE r.product_id=product_key AND NOT r.is_deleted
   AND (r.controlled_substance OR r.requires_age_verification OR r.narcotic_register_required OR r.max_order_quantity<requested_quantity)) THEN
   RAISE EXCEPTION 'Product requires an approved regulatory eligibility workflow' USING ERRCODE='23514'; END IF;
END $function$
```

### `catalog.clinical_identity(product_key uuid, variant_key uuid)`

```sql
CREATE OR REPLACE FUNCTION catalog.clinical_identity(product_key uuid, variant_key uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
 SELECT jsonb_build_object('product_id',p.id,'name',p.name,'strength',p.strength_display,'dosage_form_id',p.dosage_form_id,
   'pack_size',p.pack_size_display,'variant_id',variant_key,'variant_strength',v.strength_display,'variant_pack_quantity',v.pack_quantity)
 FROM catalog.products p LEFT JOIN catalog.product_variants v ON v.id=variant_key AND v.product_id=p.id WHERE p.id=product_key
$function$
```

### `catalog.guard_category_parent()`

```sql
CREATE OR REPLACE FUNCTION catalog.guard_category_parent()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF NEW.parent_id IS NULL THEN RETURN NEW; END IF;
 PERFORM pg_advisory_xact_lock(617430922);
 IF NEW.parent_id=NEW.id OR EXISTS(
   WITH RECURSIVE ancestors(id,parent_id,path) AS (
    SELECT c.id,c.parent_id,ARRAY[c.id] FROM catalog.categories c WHERE c.id=NEW.parent_id
    UNION ALL SELECT c.id,c.parent_id,a.path||c.id FROM catalog.categories c JOIN ancestors a ON c.id=a.parent_id WHERE NOT c.id=ANY(a.path)
   ) SELECT 1 FROM ancestors WHERE id=NEW.id OR parent_id=NEW.id
 ) THEN RAISE EXCEPTION 'Category hierarchy must be acyclic' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `catalog.guard_classification()`

```sql
CREATE OR REPLACE FUNCTION catalog.guard_classification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF TG_OP='INSERT' THEN
   IF NEW.commerce_class IS NOT NULL THEN RAISE EXCEPTION 'Create unclassified, then approve through history' USING ERRCODE='23514'; END IF;
 ELSIF (NEW.commerce_class,NEW.commerce_class_version,NEW.commerce_class_approved_by_user_id,NEW.commerce_class_approved_at,NEW.prescription_required)
 IS DISTINCT FROM (OLD.commerce_class,OLD.commerce_class_version,OLD.commerce_class_approved_by_user_id,OLD.commerce_class_approved_at,OLD.prescription_required)
 THEN
   IF pg_trigger_depth()<2 OR NEW.commerce_class IS NULL OR NOT EXISTS (
     SELECT 1 FROM catalog.product_classification_history h WHERE h.product_id=NEW.id
       AND h.version=NEW.commerce_class_version AND h.new_class=NEW.commerce_class
       AND h.approved_by_user_id=NEW.commerce_class_approved_by_user_id
       AND h.approved_at=NEW.commerce_class_approved_at
   ) OR NEW.prescription_required IS DISTINCT FROM (NEW.commerce_class='P') THEN
     RAISE EXCEPTION 'Classification changes require an approved history entry' USING ERRCODE='23514';
   END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `clinical.assert_dispatchable(item_id uuid)`

```sql
CREATE OR REPLACE FUNCTION clinical.assert_dispatchable(item_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE item commerce.order_items; product catalog.products;
BEGIN
 SELECT * INTO STRICT item FROM commerce.order_items WHERE id=item_id FOR SHARE;
 PERFORM 1 FROM commerce.orders WHERE id=item.order_id AND status NOT IN ('cancelled','closed') FOR SHARE;
 IF NOT FOUND OR item.status IN ('cancelled','rejected') OR item.commerce_class_snapshot IS NULL THEN
   RAISE EXCEPTION 'Inactive or unclassified order item' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT product FROM catalog.products WHERE id=item.product_id FOR SHARE;
 PERFORM catalog.assert_sellable(item.product_id,item.quantity);
 IF item.product_snapshot->'_clinical_identity' IS DISTINCT FROM catalog.clinical_identity(item.product_id,item.variant_id) THEN
   RAISE EXCEPTION 'Quoted SKU dose/form/strength is stale' USING ERRCODE='23514'; END IF;
 IF product.status<>'active' OR product.is_deleted OR product.commerce_class IS DISTINCT FROM item.commerce_class_snapshot
 OR product.commerce_class_version IS DISTINCT FROM item.commerce_class_version_snapshot THEN
   RAISE EXCEPTION 'Product classification or availability changed; revalidate basket' USING ERRCODE='23514'; END IF;
 IF item.commerce_class_snapshot='P' AND NOT EXISTS (
   SELECT 1 FROM clinical.order_review_items ri JOIN clinical.order_reviews r ON r.id=ri.review_id
   JOIN clinical.prescriptions rx ON rx.id=r.prescription_id
   JOIN clinical.prescription_documents d ON d.id=r.prescription_document_id
   JOIN platform.file_objects f ON f.id=d.file_object_id
   WHERE ri.order_item_id=item.id AND ri.decision='approved' AND ri.approved_quantity>=item.quantity
     AND r.status IN ('approved','partially_approved') AND rx.id=item.prescription_id
     AND rx.status NOT IN ('cancelled','expired','rejected') AND rx.valid_until>now()
     AND f.access_type='private' AND f.status='available' AND f.malware_scan_status='clean' AND NOT f.is_deleted
     AND NOT EXISTS(SELECT 1 FROM clinical.prescription_documents nd WHERE nd.prescription_id=rx.id AND nd.version_number>d.version_number)
     AND NOT EXISTS(SELECT 1 FROM clinical.order_reviews nr WHERE nr.order_id=r.order_id AND nr.review_version>r.review_version)
 ) THEN RAISE EXCEPTION 'Current P-line approval and safe private prescription required' USING ERRCODE='23514'; END IF;
END $function$
```

### `clinical.guard_document()`

```sql
CREATE OR REPLACE FUNCTION clinical.guard_document()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF TG_OP<>'INSERT' THEN
   IF EXISTS(SELECT 1 FROM clinical.order_reviews WHERE prescription_document_id=OLD.id)
   OR TG_OP='UPDATE' AND (NEW.file_object_id,NEW.prescription_id,NEW.version_number) IS DISTINCT FROM (OLD.file_object_id,OLD.prescription_id,OLD.version_number) THEN
     RAISE EXCEPTION 'Prescription document identity is immutable' USING ERRCODE='23514';
   END IF;
   IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 ELSE
   PERFORM 1 FROM clinical.prescriptions WHERE id=NEW.prescription_id FOR UPDATE;
   IF NEW.version_number IS NULL THEN SELECT coalesce(max(version_number),0)+1 INTO NEW.version_number
     FROM clinical.prescription_documents WHERE prescription_id=NEW.prescription_id; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `clinical.guard_review()`

```sql
CREATE OR REPLACE FUNCTION clinical.guard_review()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE target_order commerce.orders;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain clinical review history' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT target_order FROM commerce.orders WHERE id=NEW.order_id FOR UPDATE;
 IF (target_order.status IN ('cancelled','closed') OR NOT commerce.requires_review(NEW.order_id))
 AND NEW.status NOT IN ('cancelled','superseded') THEN
   RAISE EXCEPTION 'No active P lines for review' USING ERRCODE='23514';
 END IF;
 IF TG_OP='UPDATE' THEN
   IF (NEW.order_id,NEW.patient_profile_id,NEW.prescription_id,NEW.prescription_document_id,NEW.review_version)
   IS DISTINCT FROM (OLD.order_id,OLD.patient_profile_id,OLD.prescription_id,OLD.prescription_document_id,OLD.review_version) THEN
     RAISE EXCEPTION 'Review identity is immutable' USING ERRCODE='23514';
   END IF;
   IF OLD.status IN ('approved','partially_approved','rejected','superseded','cancelled')
   AND NOT (NEW.status='superseded' AND OLD.status IN ('approved','partially_approved','rejected')
     AND (to_jsonb(NEW)-'status'-'updated_at'-'row_version')=(to_jsonb(OLD)-'status'-'updated_at'-'row_version')) THEN
     RAISE EXCEPTION 'Completed review is immutable; create a new version' USING ERRCODE='23514';
   END IF;
 END IF;
 IF NEW.status IN ('approved','partially_approved','rejected') THEN
   PERFORM platform.require_permission(NEW.reviewed_by_user_id,'clinical.review');
   IF NEW.reviewed_at IS NULL OR EXISTS (
     SELECT 1 FROM commerce.order_items i WHERE i.order_id=NEW.order_id AND i.commerce_class_snapshot='P'
     AND i.status NOT IN ('cancelled','rejected') AND NOT EXISTS (
       SELECT 1 FROM clinical.order_review_items ri WHERE ri.review_id=NEW.id AND ri.order_item_id=i.id AND ri.decision<>'pending'
     )
   ) THEN RAISE EXCEPTION 'Every active P line needs a completed decision' USING ERRCODE='23514'; END IF;
   IF NEW.status='approved' AND EXISTS (SELECT 1 FROM clinical.order_review_items WHERE review_id=NEW.id AND decision<>'approved')
   OR NEW.status='rejected' AND EXISTS (SELECT 1 FROM clinical.order_review_items WHERE review_id=NEW.id AND decision='approved')
   OR NEW.status='partially_approved' AND (NOT EXISTS (SELECT 1 FROM clinical.order_review_items WHERE review_id=NEW.id AND decision='approved')
     OR NOT EXISTS (SELECT 1 FROM clinical.order_review_items WHERE review_id=NEW.id AND decision IN ('rejected','needs_new_rx'))) THEN
     RAISE EXCEPTION 'Review summary does not match line decisions' USING ERRCODE='23514';
   END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `clinical.guard_review_item()`

```sql
CREATE OR REPLACE FUNCTION clinical.guard_review_item()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE review clinical.order_reviews; item commerce.order_items; rx clinical.prescriptions;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain clinical decisions' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT review FROM clinical.order_reviews WHERE id=NEW.review_id FOR UPDATE;
 PERFORM 1 FROM commerce.orders WHERE id=review.order_id AND status NOT IN ('cancelled','closed') FOR UPDATE;
 IF NOT FOUND OR review.status NOT IN ('pending','in_review','action_required') THEN
   RAISE EXCEPTION 'Review is no longer open' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT item FROM commerce.order_items WHERE id=NEW.order_item_id FOR UPDATE;
 SELECT * INTO STRICT rx FROM clinical.prescriptions WHERE id=review.prescription_id FOR SHARE;
 IF item.commerce_class_snapshot IS DISTINCT FROM 'P' OR item.status IN ('cancelled','rejected')
 OR item.prescription_id IS DISTINCT FROM review.prescription_id OR item.order_id<>review.order_id
 OR rx.status IN ('cancelled','expired','rejected') OR rx.valid_until IS NULL OR rx.valid_until<=now()
 OR EXISTS (SELECT 1 FROM catalog.products p WHERE p.id=item.product_id
   AND (p.commerce_class IS DISTINCT FROM 'P' OR p.commerce_class_version<>item.commerce_class_version_snapshot))
 OR (NEW.approved_quantity IS NOT NULL AND NEW.approved_quantity>item.quantity) THEN
   RAISE EXCEPTION 'Unsafe, stale or mismatched P decision' USING ERRCODE='23514'; END IF;
 IF item.product_snapshot->'_clinical_identity' IS DISTINCT FROM catalog.clinical_identity(item.product_id,item.variant_id) THEN
   RAISE EXCEPTION 'SKU dose/form/strength changed; fresh line and review required' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' AND (OLD.decision<>'pending' OR (NEW.review_id,NEW.order_item_id,NEW.order_id,NEW.prescription_id,NEW.prescription_item_id)
   IS DISTINCT FROM (OLD.review_id,OLD.order_item_id,OLD.order_id,OLD.prescription_id,OLD.prescription_item_id)) THEN
   RAISE EXCEPTION 'Completed decisions are immutable' USING ERRCODE='23514'; END IF;
 IF NEW.decision<>'pending' THEN
   PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'clinical.review');
   NEW.decided_at=now();
 END IF;
 IF NEW.prescription_item_id IS NOT NULL AND NOT EXISTS (
   SELECT 1 FROM clinical.prescription_items pi WHERE pi.id=NEW.prescription_item_id
     AND pi.prescription_id=review.prescription_id AND pi.product_id=item.product_id
     AND (pi.quantity IS NULL OR NEW.approved_quantity IS NULL OR NEW.approved_quantity<=pi.quantity)
 ) THEN RAISE EXCEPTION 'Rx item product/quantity mismatch' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `commerce.assert_current_revision(target_order uuid, target_revision uuid)`

```sql
CREATE OR REPLACE FUNCTION commerce.assert_current_revision(target_order uuid, target_revision uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF target_revision IS NULL OR NOT EXISTS(SELECT 1 FROM commerce.orders o JOIN commerce.order_revisions r ON r.id=o.current_revision_id
   WHERE o.id=target_order AND r.id=target_revision AND r.order_id=o.id AND r.status='accepted' AND o.status NOT IN ('cancelled','closed')) THEN
   RAISE EXCEPTION 'Current customer-accepted order revision required' USING ERRCODE='23514'; END IF;
END $function$
```

### `commerce.guard_order_item()`

```sql
CREATE OR REPLACE FUNCTION commerce.guard_order_item()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE product catalog.products; target_order commerce.orders;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain order line history; revise basket instead' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT target_order FROM commerce.orders WHERE id=NEW.order_id FOR UPDATE;
 IF TG_OP='INSERT' AND target_order.status IN ('cancelled','closed') THEN
   RAISE EXCEPTION 'Cannot add lines to an inactive order' USING ERRCODE='23514'; END IF;
 IF NEW.quantity::text='NaN' OR NEW.unit_price::text='NaN' OR NEW.unit_mrp::text='NaN'
 OR NEW.discount_amount::text='NaN' OR NEW.tax_amount::text='NaN' OR NEW.line_total::text='NaN'
 OR NEW.line_total<>round(NEW.quantity*NEW.unit_price,2)-NEW.discount_amount+NEW.tax_amount THEN
   RAISE EXCEPTION 'Order line totals must equal finite quantity/price/discount/tax' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' THEN
   SELECT * INTO STRICT product FROM catalog.products WHERE id=NEW.product_id FOR SHARE;
   IF product.commerce_class IS NULL OR product.status<>'active' OR product.is_deleted
   OR product.product_type IN ('lab_test','service')
   OR NOT EXISTS(SELECT 1 FROM catalog.commerce_classes c WHERE c.code=product.commerce_class AND c.is_active)
   OR EXISTS(SELECT 1 FROM catalog.product_regulatory r WHERE r.product_id=product.id AND NOT r.is_deleted
     AND (r.controlled_substance OR r.requires_age_verification OR r.narcotic_register_required
       OR r.max_order_quantity IS NOT NULL AND NEW.quantity>r.max_order_quantity)) THEN
     RAISE EXCEPTION 'Unapproved or unavailable product cannot enter checkout' USING ERRCODE='23514';
   END IF;
   IF (NEW.commerce_class_snapshot IS NOT NULL AND NEW.commerce_class_snapshot<>product.commerce_class)
   OR (NEW.commerce_class_version_snapshot IS NOT NULL AND NEW.commerce_class_version_snapshot<>product.commerce_class_version) THEN
     RAISE EXCEPTION 'Client classification snapshot mismatch' USING ERRCODE='23514';
   END IF;
   NEW.commerce_class_snapshot=product.commerce_class;
   NEW.commerce_class_version_snapshot=product.commerce_class_version;
   NEW.product_snapshot=jsonb_set(NEW.product_snapshot,'{_clinical_identity}',catalog.clinical_identity(NEW.product_id,NEW.variant_id),true);
 ELSE
   IF (NEW.order_id,NEW.product_id,NEW.variant_id,NEW.product_snapshot,NEW.commerce_class_snapshot,NEW.commerce_class_version_snapshot)
   IS DISTINCT FROM (OLD.order_id,OLD.product_id,OLD.variant_id,OLD.product_snapshot,OLD.commerce_class_snapshot,OLD.commerce_class_version_snapshot) THEN
     RAISE EXCEPTION 'Immutable order identity/snapshot; create a revised line' USING ERRCODE='23514';
   END IF;
 END IF;
 IF NEW.commerce_class_snapshot='P' AND NEW.status NOT IN ('cancelled','rejected') THEN
   IF target_order.patient_profile_id IS NULL OR NEW.prescription_id IS NULL OR NOT EXISTS (
     SELECT 1 FROM clinical.prescriptions WHERE id=NEW.prescription_id AND patient_profile_id=target_order.patient_profile_id
   ) THEN RAISE EXCEPTION 'P line requires the order patient and matching prescription' USING ERRCODE='23514'; END IF;
 END IF;
 IF EXISTS(SELECT 1 FROM commerce.order_revisions WHERE order_id=NEW.order_id AND status='accepted') THEN
   IF TG_OP='INSERT' THEN RAISE EXCEPTION 'Supersede accepted basket before adding lines' USING ERRCODE='23514'; END IF;
   IF (NEW.quantity,NEW.unit_mrp,NEW.unit_price,NEW.discount_amount,NEW.tax_amount,NEW.line_total,NEW.status,NEW.prescription_id)
   IS DISTINCT FROM (OLD.quantity,OLD.unit_mrp,OLD.unit_price,OLD.discount_amount,OLD.tax_amount,OLD.line_total,OLD.status,OLD.prescription_id) THEN
     RAISE EXCEPTION 'Accepted basket changes require fresh customer consent' USING ERRCODE='23514';
   END IF;
 END IF;
 IF TG_OP='UPDATE' AND (NEW.quantity,NEW.prescription_id,NEW.unit_price,NEW.line_total)
 IS DISTINCT FROM (OLD.quantity,OLD.prescription_id,OLD.unit_price,OLD.line_total)
 AND EXISTS(SELECT 1 FROM clinical.order_review_items i JOIN clinical.order_reviews r ON r.id=i.review_id
   WHERE i.order_item_id=NEW.id AND i.decision<>'pending' AND r.status NOT IN ('superseded','cancelled')) THEN
   RAISE EXCEPTION 'Supersede clinical approval before changing reviewed lines' USING ERRCODE='23514';
 END IF;
 RETURN NEW;
END $function$
```

### `commerce.guard_order_patient_and_money()`

```sql
CREATE OR REPLACE FUNCTION commerce.guard_order_patient_and_money()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF NEW.patient_profile_id IS DISTINCT FROM OLD.patient_profile_id AND EXISTS(
   SELECT 1 FROM commerce.order_items i LEFT JOIN clinical.prescriptions rx ON rx.id=i.prescription_id
   WHERE i.order_id=OLD.id AND i.commerce_class_snapshot='P' AND i.status NOT IN ('cancelled','rejected')
     AND (NEW.patient_profile_id IS NULL OR rx.patient_profile_id IS DISTINCT FROM NEW.patient_profile_id)
 ) THEN RAISE EXCEPTION 'Order patient must match every active P prescription' USING ERRCODE='23514'; END IF;
 IF EXISTS(SELECT 1 FROM commerce.order_revisions r WHERE r.order_id=OLD.id AND r.status='accepted'
   AND (NEW.current_revision_id,NEW.currency,NEW.subtotal,NEW.discount_total,NEW.tax_total,NEW.shipping_total,NEW.other_charges_total,NEW.grand_total)
   IS DISTINCT FROM (r.id,r.currency,r.subtotal,r.discount_total,r.tax_total,r.shipping_total,r.other_charges_total,r.grand_total)) THEN
   RAISE EXCEPTION 'Order totals must match the accepted revision' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `commerce.guard_revision()`

```sql
CREATE OR REPLACE FUNCTION commerce.guard_revision()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE target_order commerce.orders;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain quote and consent history' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT target_order FROM commerce.orders WHERE id=NEW.order_id FOR UPDATE;
 IF TG_OP='UPDATE' AND (to_jsonb(NEW)-'status'-'accepted_by_user_id'-'accepted_at') IS DISTINCT FROM
   (to_jsonb(OLD)-'status'-'accepted_by_user_id'-'accepted_at') THEN
   RAISE EXCEPTION 'Quote payload immutable; propose new revision' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' AND (OLD.status IN ('superseded','cancelled') OR
   OLD.status='accepted' AND (NEW.status<>'superseded' OR NEW.accepted_at IS DISTINCT FROM OLD.accepted_at
     OR NEW.accepted_by_user_id IS DISTINCT FROM OLD.accepted_by_user_id)) THEN
   RAISE EXCEPTION 'Consent history is immutable' USING ERRCODE='23514'; END IF;
 IF NEW.status='accepted' THEN
   IF NEW.accepted_by_user_id IS DISTINCT FROM target_order.user_id
   OR NEW.accepted_by_user_id::text IS DISTINCT FROM current_setting('pharmville.actor_user_id',true)
   OR target_order.status IN ('cancelled','closed') THEN RAISE EXCEPTION 'Customer acceptance required' USING ERRCODE='23514'; END IF;
   IF EXISTS(SELECT 1 FROM commerce.order_items WHERE order_id=NEW.order_id AND status NOT IN ('cancelled','rejected')
     AND (commerce_class_snapshot IS NULL OR commerce_class_version_snapshot IS NULL)) THEN
     RAISE EXCEPTION 'Unclassified legacy basket requires explicit review' USING ERRCODE='23514'; END IF;
   IF NEW.line_items_snapshot IS DISTINCT FROM (
     SELECT jsonb_agg(jsonb_build_object('id',id::text,'product_id',product_id::text,'variant_id',variant_id::text,
       'quantity',quantity::text,'unit_price',unit_price::text,'discount',discount_amount::text,'tax',tax_amount::text,
       'line_total',line_total::text,'commerce_class',commerce_class_snapshot,'class_version',commerce_class_version_snapshot,
       'clinical_identity',product_snapshot->'_clinical_identity') ORDER BY id)
     FROM commerce.order_items WHERE order_id=NEW.order_id AND status NOT IN ('cancelled','rejected')
   ) THEN RAISE EXCEPTION 'Quote line snapshot differs from current basket' USING ERRCODE='23514'; END IF;
   IF EXISTS(SELECT 1 FROM commerce.order_items i JOIN catalog.products p ON p.id=i.product_id
     WHERE i.order_id=NEW.order_id AND i.status NOT IN ('cancelled','rejected')
     AND (p.commerce_class IS DISTINCT FROM i.commerce_class_snapshot OR p.commerce_class_version IS DISTINCT FROM i.commerce_class_version_snapshot
       OR p.status<>'active' OR p.is_deleted)) THEN
     RAISE EXCEPTION 'Current basket classification changed' USING ERRCODE='23514'; END IF;
   IF NEW.grand_total<>(SELECT coalesce(sum(line_total),0) FROM commerce.order_items WHERE order_id=NEW.order_id AND status NOT IN ('cancelled','rejected'))
      + NEW.shipping_total+NEW.other_charges_total THEN
     RAISE EXCEPTION 'Quote does not equal current basket totals' USING ERRCODE='23514'; END IF;
   IF NEW.currency<>target_order.currency
   OR NEW.subtotal<>(SELECT coalesce(sum(round(quantity*unit_price,2)),0) FROM commerce.order_items WHERE order_id=NEW.order_id AND status NOT IN ('cancelled','rejected'))
   OR NEW.discount_total<>(SELECT coalesce(sum(discount_amount),0) FROM commerce.order_items WHERE order_id=NEW.order_id AND status NOT IN ('cancelled','rejected'))
   OR NEW.tax_total<>(SELECT coalesce(sum(tax_amount),0) FROM commerce.order_items WHERE order_id=NEW.order_id AND status NOT IN ('cancelled','rejected')) THEN
     RAISE EXCEPTION 'Quote currency or amount components differ from basket' USING ERRCODE='23514'; END IF;
   NEW.accepted_at=clock_timestamp();
 END IF;
 RETURN NEW;
END $function$
```

### `commerce.refresh_clinical_gate()`

```sql
CREATE OR REPLACE FUNCTION commerce.refresh_clinical_gate()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE old_gate text; new_gate text;
BEGIN
 SELECT prescription_status INTO old_gate FROM commerce.orders WHERE id=NEW.order_id FOR UPDATE;
 new_gate=CASE WHEN commerce.requires_review(NEW.order_id) THEN 'REVIEW_REQUIRED' ELSE 'NOT_REQUIRED' END;
 UPDATE commerce.orders SET prescription_status=new_gate, updated_at=now(),row_version=row_version+1 WHERE id=NEW.order_id;
 IF old_gate IS DISTINCT FROM new_gate THEN
   INSERT INTO platform.audit_logs(actor_user_id,actor_type,action,resource_type,resource_id,before_data,after_data)
   VALUES(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'service','clinical_gate_changed','order',NEW.order_id::text,
     jsonb_build_object('gate',old_gate),jsonb_build_object('gate',new_gate));
 END IF;
 IF new_gate='NOT_REQUIRED' THEN
   UPDATE clinical.order_reviews SET status='cancelled',updated_at=now(),row_version=row_version+1
   WHERE order_id=NEW.order_id AND status IN ('pending','in_review','action_required');
 END IF;
 RETURN NEW;
END $function$
```

### `commerce.requires_review(target_order uuid)`

```sql
CREATE OR REPLACE FUNCTION commerce.requires_review(target_order uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
 SELECT EXISTS(SELECT 1 FROM commerce.order_items WHERE order_id=target_order
   AND status NOT IN ('cancelled','rejected') AND commerce_class_snapshot='P')
$function$
```

### `commerce.sync_accepted_revision()`

```sql
CREATE OR REPLACE FUNCTION commerce.sync_accepted_revision()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF NEW.status='accepted' THEN
   UPDATE commerce.orders SET current_revision_id=NEW.id,currency=NEW.currency,subtotal=NEW.subtotal,discount_total=NEW.discount_total,
     tax_total=NEW.tax_total,shipping_total=NEW.shipping_total,other_charges_total=NEW.other_charges_total,
     grand_total=NEW.grand_total,updated_at=now(),row_version=row_version+1 WHERE id=NEW.order_id;
   INSERT INTO platform.audit_logs(actor_user_id,actor_type,action,resource_type,resource_id,after_data)
   VALUES(NEW.accepted_by_user_id,'customer','basket_revision_accepted','order',NEW.order_id::text,
     jsonb_build_object('revision_id',NEW.id));
 END IF;
 RETURN NEW;
END $function$
```

### `fulfillment.assert_work_scope(target_fulfillment uuid, target_item uuid)`

```sql
CREATE OR REPLACE FUNCTION fulfillment.assert_work_scope(target_fulfillment uuid, target_item uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE work fulfillment.fulfillment_orders; line record;
BEGIN
 SELECT * INTO work FROM fulfillment.fulfillment_orders WHERE id=target_fulfillment FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Unknown fulfillment work scope' USING ERRCODE='23503'; END IF;
 PERFORM 1 FROM commerce.orders WHERE id=work.order_id FOR UPDATE;
 PERFORM warehouse.assert_authorized_location(work.warehouse_id,work.seller_id);
 PERFORM commerce.assert_current_revision(work.order_id,work.order_revision_id);
 IF target_item IS NOT NULL AND NOT EXISTS(SELECT 1 FROM commerce.order_items WHERE id=target_item AND order_id=work.order_id AND status NOT IN ('cancelled','rejected')) THEN
  RAISE EXCEPTION 'Cross-order or inactive fulfillment item' USING ERRCODE='23514'; END IF;
 FOR line IN SELECT id FROM commerce.order_items WHERE order_id=work.order_id AND status NOT IN ('cancelled','rejected') AND (target_item IS NULL OR id=target_item) LOOP
  PERFORM clinical.assert_dispatchable(line.id);
 END LOOP;
END $function$
```

### `fulfillment.guard_authorized_fulfillment()`

```sql
CREATE OR REPLACE FUNCTION fulfillment.guard_authorized_fulfillment()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF TG_OP='INSERT' AND NEW.status<>'created' OR TG_OP='UPDATE' AND
  (NEW.order_id,NEW.warehouse_id,NEW.seller_id,NEW.order_revision_id) IS DISTINCT FROM (OLD.order_id,OLD.warehouse_id,OLD.seller_id,OLD.order_revision_id) THEN
  RAISE EXCEPTION 'Fulfillment starts created and retains its order/site/revision identity' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' AND NEW.status<>OLD.status THEN
  IF NOT (OLD.status='created' AND NEW.status IN ('allocated','cancelled') OR OLD.status='allocated' AND NEW.status IN ('picking','cancelled')
    OR OLD.status='picking' AND NEW.status IN ('picked','cancelled') OR OLD.status='picked' AND NEW.status IN ('packing','cancelled')
    OR OLD.status='packing' AND NEW.status IN ('packed','cancelled') OR OLD.status='packed' AND NEW.status='handed_over') THEN
   RAISE EXCEPTION 'Invalid fulfillment transition' USING ERRCODE='23514'; END IF;
  IF NEW.status='cancelled' THEN RETURN NEW; END IF;
  PERFORM fulfillment.assert_work_scope(NEW.id);
 END IF;
 IF TG_OP='INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
  PERFORM warehouse.assert_authorized_location(NEW.warehouse_id,NEW.seller_id);
  IF EXISTS(SELECT 1 FROM warehouse.stock_reservations WHERE order_id=NEW.order_id AND status IN ('active','committed') AND warehouse_id<>NEW.warehouse_id) THEN
   RAISE EXCEPTION 'Fulfillment location differs from reserved stock' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `fulfillment.guard_package_item()`

```sql
CREATE OR REPLACE FUNCTION fulfillment.guard_package_item()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE item commerce.order_items; lot warehouse.inventory_lots;
BEGIN
 SELECT * INTO STRICT item FROM commerce.order_items WHERE id=NEW.order_item_id FOR UPDATE;
 SELECT * INTO STRICT lot FROM warehouse.inventory_lots WHERE id=NEW.lot_id FOR SHARE;
 PERFORM clinical.assert_dispatchable(item.id);
 PERFORM commerce.assert_current_revision(item.order_id,(SELECT f.order_revision_id FROM fulfillment.packages p JOIN fulfillment.fulfillment_orders f ON f.id=p.fulfillment_order_id WHERE p.id=NEW.package_id));
 IF NOT EXISTS(SELECT 1 FROM fulfillment.packages p JOIN fulfillment.fulfillment_orders f ON f.id=p.fulfillment_order_id
     WHERE p.id=NEW.package_id AND f.order_id=item.order_id AND f.warehouse_id=lot.warehouse_id)
 OR lot.product_id<>item.product_id OR lot.variant_id IS DISTINCT FROM item.variant_id
 OR lot.expires_at<=current_date OR lot.quality_status<>'approved' OR lot.recall_status<>'clear'
 OR EXISTS(SELECT 1 FROM warehouse.stock_holds WHERE lot_id=lot.id AND status='active')
 OR (SELECT coalesce(sum(quantity),0) FROM fulfillment.package_items WHERE order_item_id=item.id AND id<>NEW.id)+NEW.quantity>item.quantity THEN
   RAISE EXCEPTION 'Unsafe lot or excess package quantity' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `fulfillment.guard_package_site()`

```sql
CREATE OR REPLACE FUNCTION fulfillment.guard_package_site()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE work_id uuid;
BEGIN
 SELECT fulfillment_order_id INTO work_id FROM fulfillment.packages WHERE id=NEW.package_id;
 PERFORM fulfillment.assert_work_scope(work_id,NEW.order_item_id);
 IF NOT EXISTS(SELECT 1 FROM fulfillment.packages WHERE id=NEW.package_id AND status='created') THEN
  RAISE EXCEPTION 'Packed contents are immutable; use a new controlled package' USING ERRCODE='23514'; END IF;
 IF NEW.quantity>(SELECT coalesce(sum(quantity),0) FROM warehouse.stock_reservations WHERE order_item_id=NEW.order_item_id AND lot_id=NEW.lot_id AND (status='committed' OR status='active' AND expires_at>clock_timestamp())) THEN
  RAISE EXCEPTION 'Packing requires an exact, live reserved lot' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `fulfillment.guard_pick_item()`

```sql
CREATE OR REPLACE FUNCTION fulfillment.guard_pick_item()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE work fulfillment.fulfillment_orders; lot warehouse.inventory_lots;
BEGIN
 PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'inventory.pick');
 SELECT f.* INTO work FROM fulfillment.fulfillment_orders f JOIN fulfillment.pick_tasks t ON t.fulfillment_order_id=f.id WHERE t.id=NEW.pick_task_id;
 PERFORM fulfillment.assert_work_scope(work.id,NEW.order_item_id);
 SELECT * INTO lot FROM warehouse.inventory_lots WHERE id=NEW.lot_id FOR SHARE;
 IF TG_OP='UPDATE' AND (NEW.pick_task_id,NEW.order_item_id,NEW.lot_id,NEW.bin_id,NEW.required_qty) IS DISTINCT FROM (OLD.pick_task_id,OLD.order_item_id,OLD.lot_id,OLD.bin_id,OLD.required_qty) THEN
  RAISE EXCEPTION 'Pick identity and required quantity are immutable' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM fulfillment.fulfillment_order_items WHERE fulfillment_order_id=work.id AND order_item_id=NEW.order_item_id AND required_qty>=NEW.required_qty)
  OR NOT EXISTS(SELECT 1 FROM warehouse.bins WHERE id=NEW.bin_id AND warehouse_id=work.warehouse_id)
  OR NOT EXISTS(SELECT 1 FROM commerce.order_items WHERE id=NEW.order_item_id AND product_id=lot.product_id AND variant_id IS NOT DISTINCT FROM lot.variant_id)
  OR lot.warehouse_id<>work.warehouse_id OR lot.expires_at<=current_date OR lot.quality_status<>'approved' OR lot.recall_status<>'clear'
  OR EXISTS(SELECT 1 FROM warehouse.stock_holds WHERE lot_id=lot.id AND status='active')
  OR NEW.required_qty+(SELECT coalesce(sum(p.required_qty),0) FROM fulfillment.pick_task_items p JOIN fulfillment.pick_tasks t ON t.id=p.pick_task_id WHERE p.order_item_id=NEW.order_item_id AND p.id<>NEW.id AND t.status<>'cancelled')>(SELECT quantity FROM commerce.order_items WHERE id=NEW.order_item_id)
  OR NOT EXISTS(SELECT 1 FROM warehouse.stock_reservations WHERE order_item_id=NEW.order_item_id AND warehouse_id=work.warehouse_id AND lot_id=NEW.lot_id AND bin_id=NEW.bin_id AND quantity>=NEW.required_qty AND (status='committed' OR status='active' AND expires_at>clock_timestamp())) THEN
   RAISE EXCEPTION 'Pick requires exact reserved, safe lot/bin/order scope' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `fulfillment.guard_task_entry()`

```sql
CREATE OR REPLACE FUNCTION fulfillment.guard_task_entry()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE warehouse_id uuid;
BEGIN
 IF TG_OP='UPDATE' AND NEW.fulfillment_order_id<>OLD.fulfillment_order_id THEN RAISE EXCEPTION 'Work scope is immutable' USING ERRCODE='23514'; END IF;
 IF TG_TABLE_NAME IN ('pick_tasks','pack_tasks') THEN
  PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,CASE TG_TABLE_NAME WHEN 'pick_tasks' THEN 'inventory.pick' ELSE 'inventory.pack' END);
  IF TG_OP='INSERT' AND NEW.status<>'created' OR TG_OP='UPDATE' AND NEW.status<>OLD.status AND NOT (
    OLD.status='created' AND NEW.status IN ('assigned','in_progress','cancelled') OR
    OLD.status='assigned' AND NEW.status IN ('in_progress','cancelled') OR
    OLD.status='in_progress' AND NEW.status IN ('completed','cancelled')) THEN
   RAISE EXCEPTION 'Invalid warehouse task transition' USING ERRCODE='23514'; END IF;
  IF NEW.status='cancelled' THEN RETURN NEW; END IF;
  IF NEW.status='completed' THEN
   IF TG_TABLE_NAME='pick_tasks' THEN
    IF NOT EXISTS(SELECT 1 FROM fulfillment.pick_task_items WHERE pick_task_id=NEW.id) OR EXISTS(SELECT 1 FROM fulfillment.pick_task_items WHERE pick_task_id=NEW.id AND picked_qty<required_qty) THEN
     RAISE EXCEPTION 'Cannot complete empty or incomplete picking work' USING ERRCODE='23514'; END IF;
   ELSE
    IF NOT EXISTS(SELECT 1 FROM fulfillment.packages WHERE pack_task_id=NEW.id AND status='packed' AND packed_at IS NOT NULL) THEN
     RAISE EXCEPTION 'Cannot complete packing without a completed package' USING ERRCODE='23514'; END IF;
   END IF;
  END IF;
 END IF;
 IF TG_TABLE_NAME='packages' AND NEW.status IN ('created','cancelled') THEN
  SELECT f.warehouse_id INTO warehouse_id FROM fulfillment.fulfillment_orders f WHERE f.id=NEW.fulfillment_order_id;
  PERFORM warehouse.assert_authorized_location(warehouse_id);
 ELSE
  PERFORM fulfillment.assert_work_scope(NEW.fulfillment_order_id);
 END IF;
 IF TG_TABLE_NAME='pick_tasks' THEN
  IF NEW.wave_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM fulfillment.picking_waves w JOIN fulfillment.fulfillment_orders f ON f.warehouse_id=w.warehouse_id WHERE w.id=NEW.wave_id AND f.id=NEW.fulfillment_order_id) THEN
   RAISE EXCEPTION 'Cross-warehouse picking wave' USING ERRCODE='23514'; END IF;
 END IF;
 IF TG_TABLE_NAME='packages' THEN
  IF TG_OP='INSERT' AND NEW.status NOT IN ('created','packed') OR TG_OP='UPDATE' AND NEW.status<>OLD.status AND NOT (OLD.status='created' AND NEW.status IN ('packed','cancelled')) THEN
   RAISE EXCEPTION 'Invalid package transition' USING ERRCODE='23514'; END IF;
  IF NEW.status='packed' THEN
   PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'inventory.pack');
   IF NOT EXISTS(SELECT 1 FROM fulfillment.package_items WHERE package_id=NEW.id) THEN RAISE EXCEPTION 'Cannot complete an empty package' USING ERRCODE='23514'; END IF;
   IF TG_OP='INSERT' OR OLD.status<>'packed' THEN
    NEW.packed_by_user_id=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid; NEW.packed_at=clock_timestamp();
   ELSIF (NEW.packed_by_user_id,NEW.packed_at) IS DISTINCT FROM (OLD.packed_by_user_id,OLD.packed_at) THEN
    RAISE EXCEPTION 'Packing evidence is immutable' USING ERRCODE='23514'; END IF;
  END IF;
  IF NEW.pack_task_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM fulfillment.pack_tasks WHERE id=NEW.pack_task_id AND fulfillment_order_id=NEW.fulfillment_order_id) THEN
   RAISE EXCEPTION 'Package belongs to another pack task' USING ERRCODE='23514'; END IF;
 END IF;
 IF TG_TABLE_NAME='fulfillment_order_items' THEN
  PERFORM fulfillment.assert_work_scope(NEW.fulfillment_order_id,NEW.order_item_id);
  IF NEW.required_qty+(SELECT coalesce(sum(required_qty),0) FROM fulfillment.fulfillment_order_items WHERE order_item_id=NEW.order_item_id AND id<>NEW.id AND status NOT IN ('cancelled','rejected'))>(SELECT quantity FROM commerce.order_items WHERE id=NEW.order_item_id) THEN
   RAISE EXCEPTION 'Fulfillment quantity exceeds ordered quantity' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `logistics.audit_otp_outcome()`

```sql
CREATE OR REPLACE FUNCTION logistics.audit_otp_outcome()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 INSERT INTO platform.audit_logs(actor_user_id,actor_type,action,resource_type,resource_id,after_data)
 VALUES(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'service','otp_'||NEW.status,'delivery_otp_challenge',NEW.id::text,
   jsonb_build_object('status',NEW.status,'attempt_count',NEW.attempt_count));
 RETURN NEW;
END $function$
```

### `logistics.guard_assignment_history()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_assignment_history()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE actor uuid;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain assignment history' USING ERRCODE='23514'; END IF;
 actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
 PERFORM platform.require_permission(actor,'logistics.assign');
 PERFORM 1 FROM logistics.shipments WHERE id=NEW.shipment_id FOR UPDATE;
 IF TG_OP='INSERT' THEN NEW.assigned_at=clock_timestamp();
 ELSIF NOT OLD.is_current OR (NEW.shipment_id,NEW.delivery_user_id,NEW.assigned_at) IS DISTINCT FROM (OLD.shipment_id,OLD.delivery_user_id,OLD.assigned_at) THEN
   RAISE EXCEPTION 'Reassignment is a new history row, never an identity overwrite' USING ERRCODE='23514'; END IF;
 IF NOT NEW.is_current THEN
   NEW.ended_at=clock_timestamp();
   UPDATE logistics.delivery_otp_challenges SET status='cancelled',updated_at=now() WHERE assignment_id=NEW.id AND status='active';
 END IF;
 RETURN NEW;
END $function$
```

### `logistics.guard_authorized_dispatch()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_authorized_dispatch()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE eligible_warehouse uuid; eligible_seller uuid;
BEGIN
 IF NEW.status IN ('picked_up','in_transit','out_for_delivery','delivered') THEN
  SELECT f.warehouse_id,f.seller_id INTO eligible_warehouse,eligible_seller FROM fulfillment.fulfillment_orders f
    JOIN fulfillment.packages p ON p.fulfillment_order_id=f.id WHERE p.id=NEW.package_id AND f.order_id=NEW.order_id;
  IF eligible_warehouse IS NULL THEN RAISE EXCEPTION 'Authorized order-scoped package required' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM fulfillment.packages WHERE id=NEW.package_id AND status='packed' AND packed_at IS NOT NULL AND packed_by_user_id IS NOT NULL) THEN
   RAISE EXCEPTION 'A completed, authorized package is required before dispatch' USING ERRCODE='23514'; END IF;
  IF NOT EXISTS(SELECT 1 FROM payment.payment_intents p JOIN commerce.orders o ON o.id=p.order_id JOIN commerce.order_revisions r ON r.id=p.order_revision_id
      WHERE p.order_id=NEW.order_id AND p.order_revision_id=NEW.order_revision_id AND p.status='captured' AND p.amount=r.grand_total AND p.currency=o.currency)
    AND NOT EXISTS(SELECT 1 FROM payment.cod_collections c JOIN platform.application_settings policy ON policy.namespace='pharmville' AND policy.key='cod_policy' AND NOT policy.is_deleted
      WHERE c.shipment_id=NEW.id AND c.order_id=NEW.order_id AND c.order_revision_id=NEW.order_revision_id AND c.status IN ('pending','collected') AND policy.value->>'approved'='true' AND policy.value->>'single_shipment'='true'
       AND NOT EXISTS(SELECT 1 FROM logistics.shipments other WHERE other.order_id=NEW.order_id AND other.id<>NEW.id AND other.status NOT IN ('cancelled','created'))) THEN
   RAISE EXCEPTION 'Authoritative full payment or approved shipment-scoped COD required before dispatch' USING ERRCODE='23514'; END IF;
  IF EXISTS(SELECT 1 FROM fulfillment.package_items pi WHERE pi.package_id=NEW.package_id AND pi.quantity>(SELECT coalesce(sum(r.quantity),0) FROM warehouse.stock_reservations r WHERE r.order_item_id=pi.order_item_id AND r.lot_id=pi.lot_id AND r.warehouse_id=eligible_warehouse AND r.order_revision_id=NEW.order_revision_id AND r.status='committed')) THEN
   RAISE EXCEPTION 'Dispatch requires committed stock for the exact package lots' USING ERRCODE='23514'; END IF;
  PERFORM warehouse.assert_authorized_location(eligible_warehouse,eligible_seller);
 END IF;
 RETURN NEW;
END $function$
```

### `logistics.guard_delivery_proof()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_delivery_proof()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF NEW.otp_verified AND NOT EXISTS(SELECT 1 FROM logistics.delivery_otp_challenges c
   JOIN logistics.delivery_assignments a ON a.id=c.assignment_id
   WHERE c.shipment_id=NEW.shipment_id AND c.status='verified' AND a.delivery_user_id=NEW.delivery_user_id AND a.is_current)
 OR NEW.otp_verified AND EXISTS(SELECT 1 FROM logistics.delivery_attempts p WHERE p.shipment_id=NEW.shipment_id AND p.otp_verified AND p.id<>NEW.id) THEN
   RAISE EXCEPTION 'OTP flag requires verified challenge' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `logistics.guard_location()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_location()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE assignment logistics.delivery_assignments; actor uuid;
BEGIN
 actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
 SELECT * INTO STRICT assignment FROM logistics.delivery_assignments WHERE id=NEW.assignment_id FOR SHARE;
 NEW.received_at=clock_timestamp();
 -- Status vocabulary/retention requires owner approval. Default: GPS collection disabled.
 IF NOT EXISTS(SELECT 1 FROM platform.application_settings WHERE namespace='pharmville' AND key='rider_gps_policy'
   AND NOT is_deleted AND value->>'approved'='true' AND (value->>'retention_days')::integer>0
   AND value->'active_assignment_statuses' ? assignment.status)
 OR actor IS DISTINCT FROM NEW.delivery_user_id OR assignment.delivery_user_id<>NEW.delivery_user_id
 OR assignment.completed_at IS NOT NULL OR NOT assignment.is_current OR NEW.shift_id IS NULL
 OR NOT EXISTS(SELECT 1 FROM logistics.rider_shifts s WHERE s.id=NEW.shift_id AND s.rider_user_id=NEW.delivery_user_id
   AND s.ended_at IS NULL AND s.started_at<=NEW.recorded_at) THEN
   RAISE EXCEPTION 'GPS policy or active rider authorization missing' USING ERRCODE='42501'; END IF;
 IF EXISTS(SELECT 1 FROM logistics.delivery_location_updates WHERE assignment_id=NEW.assignment_id
   AND received_at>clock_timestamp()-interval '5 seconds') THEN
   RAISE EXCEPTION 'GPS rate limit' USING ERRCODE='23514'; END IF;
 IF NEW.recorded_at>clock_timestamp()+interval '1 minute' OR NEW.recorded_at<assignment.assigned_at THEN
   RAISE EXCEPTION 'Invalid GPS timestamp' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `logistics.guard_otp()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_otp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF TG_OP='UPDATE' AND ((NEW.shipment_id,NEW.assignment_id,NEW.otp_digest,NEW.max_attempts,NEW.expires_at,NEW.created_at)
   IS DISTINCT FROM (OLD.shipment_id,OLD.assignment_id,OLD.otp_digest,OLD.max_attempts,OLD.expires_at,OLD.created_at)
   OR OLD.status<>'active' OR NEW.attempt_count<OLD.attempt_count OR NEW.attempt_count>OLD.attempt_count+1) THEN
   RAISE EXCEPTION 'Invalid OTP lifecycle mutation' USING ERRCODE='23514'; END IF;
 IF NEW.status='verified' AND (NEW.expires_at<=clock_timestamp() OR NEW.attempt_count>NEW.max_attempts) THEN
   RAISE EXCEPTION 'Expired or locked OTP' USING ERRCODE='23514'; END IF;
 IF NEW.otp_digest !~ '^hmac-sha256:[0-9a-f]{64}$' THEN RAISE EXCEPTION 'Keyed OTP digest required' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `logistics.guard_shift()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_shift()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE actor uuid;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain shift history' USING ERRCODE='23514'; END IF;
 actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
 IF actor IS DISTINCT FROM NEW.rider_user_id THEN PERFORM platform.require_permission(actor,'logistics.assign'); END IF;
 IF TG_OP='INSERT' THEN NEW.started_at=clock_timestamp();
 ELSIF OLD.ended_at IS NOT NULL OR (NEW.rider_user_id,NEW.started_at) IS DISTINCT FROM (OLD.rider_user_id,OLD.started_at) THEN
   RAISE EXCEPTION 'Shift identity and completed shifts are immutable' USING ERRCODE='23514';
 ELSIF NEW.ended_at IS NOT NULL THEN NEW.ended_at=clock_timestamp(); END IF;
 RETURN NEW;
END $function$
```

### `logistics.guard_shipment_dispatch()`

```sql
CREATE OR REPLACE FUNCTION logistics.guard_shipment_dispatch()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE line record;
BEGIN
 IF NEW.status IN ('picked_up','in_transit','out_for_delivery','delivered') THEN
   PERFORM commerce.assert_current_revision(NEW.order_id,NEW.order_revision_id);
   IF NOT EXISTS(SELECT 1 FROM fulfillment.package_items WHERE package_id=NEW.package_id) THEN
     RAISE EXCEPTION 'Cannot dispatch empty package' USING ERRCODE='23514'; END IF;
   FOR line IN SELECT pi.order_item_id,pi.lot_id,i.order_id FROM fulfillment.package_items pi
     JOIN commerce.order_items i ON i.id=pi.order_item_id WHERE pi.package_id=NEW.package_id LOOP
     IF line.order_id<>NEW.order_id THEN RAISE EXCEPTION 'Wrong order package' USING ERRCODE='23514'; END IF;
     PERFORM clinical.assert_dispatchable(line.order_item_id);
     PERFORM 1 FROM warehouse.inventory_lots WHERE id=line.lot_id AND quality_status='approved' AND recall_status='clear' AND expires_at>current_date FOR SHARE;
     IF NOT FOUND OR EXISTS(SELECT 1 FROM warehouse.stock_holds WHERE lot_id=line.lot_id AND status='active') THEN
       RAISE EXCEPTION 'Unsafe shipment lot' USING ERRCODE='23514'; END IF;
   END LOOP;
 END IF;
 RETURN NEW;
END $function$
```

### `marketplace.guard_fulfillment_approval()`

```sql
CREATE OR REPLACE FUNCTION marketplace.guard_fulfillment_approval()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE policy jsonb; actor uuid;
BEGIN
 IF NEW.authorization_status='approved' THEN
   actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
   IF TG_OP='INSERT' OR OLD.authorization_status<>'approved' THEN
    PERFORM platform.require_permission(actor,'pharmacy.authorize_location');
    policy=warehouse.fulfillment_policy();
    IF length(btrim(coalesce(NEW.approval_evidence,'')))=0 OR NOT EXISTS(
     SELECT 1 FROM warehouse.warehouses w JOIN organization.locations loc ON loc.id=w.location_id AND loc.organization_id=w.organization_id
      JOIN organization.organizations org ON org.id=w.organization_id
      JOIN marketplace.sellers s ON s.id=NEW.seller_id AND s.organization_id=w.organization_id
      JOIN organization.licenses license ON license.id=NEW.license_id AND license.organization_id=w.organization_id AND license.location_id=w.location_id
     WHERE w.id=NEW.warehouse_id AND NEW.location_id=w.location_id AND w.status='active' AND NOT w.is_deleted
      AND org.status='active' AND NOT org.is_deleted AND loc.is_active AND NOT loc.is_deleted
      AND s.verification_status='verified' AND s.status='active' AND s.is_active AND NOT s.is_deleted
      AND license.verification_status='verified' AND NOT license.is_deleted
      AND license.issued_at IS NOT NULL AND license.issued_at<=current_date AND license.expires_at IS NOT NULL AND license.expires_at>=current_date
      AND policy->'allowed_license_types' ? license.license_type) THEN
      RAISE EXCEPTION 'Verified location-specific license and explicit approval evidence required' USING ERRCODE='23514'; END IF;
    NEW.approved_by_user_id=actor; NEW.approved_at=clock_timestamp();
   ELSIF (NEW.seller_id,NEW.location_id,NEW.warehouse_id,NEW.license_id,NEW.approved_by_user_id,NEW.approved_at,NEW.approval_evidence)
    IS DISTINCT FROM (OLD.seller_id,OLD.location_id,OLD.warehouse_id,OLD.license_id,OLD.approved_by_user_id,OLD.approved_at,OLD.approval_evidence) THEN
    RAISE EXCEPTION 'Suspend approval before changing its licensed scope/evidence' USING ERRCODE='23514'; END IF;
 ELSE
   IF TG_OP='UPDATE' AND OLD.authorization_status='approved' THEN
    PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'pharmacy.authorize_location'); END IF;
   NEW.approved_by_user_id=NULL; NEW.approved_at=NULL;
 END IF;
 INSERT INTO platform.audit_logs(actor_user_id,actor_type,action,resource_type,resource_id,after_data)
 VALUES(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'staff','fulfillment_authorization','seller_location',NEW.id::text,jsonb_build_object('status',NEW.authorization_status));
 RETURN NEW;
END $function$
```

### `payment.guard_cod_lifecycle()`

```sql
CREATE OR REPLACE FUNCTION payment.guard_cod_lifecycle()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE total numeric; actor uuid;
BEGIN
 actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
 PERFORM platform.require_permission(actor,'finance.reconcile');
 IF TG_OP='UPDATE' AND OLD.status='settled' THEN RAISE EXCEPTION 'Settled cash history is immutable' USING ERRCODE='23514'; END IF;
 PERFORM commerce.assert_current_revision(NEW.order_id,NEW.order_revision_id);
 SELECT grand_total INTO total FROM commerce.order_revisions WHERE id=NEW.order_revision_id FOR SHARE;
 IF NOT EXISTS(SELECT 1 FROM logistics.shipments WHERE id=NEW.shipment_id AND order_id=NEW.order_id)
 OR NEW.amount<>total OR NOT EXISTS(SELECT 1 FROM platform.application_settings WHERE namespace='pharmville' AND key='cod_policy'
   AND NOT is_deleted AND value->>'approved'='true' AND value->>'single_shipment'='true') THEN
   RAISE EXCEPTION 'COD eligibility/scope requires an approved operations policy' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' THEN
   IF NEW.status<>'pending' THEN RAISE EXCEPTION 'COD begins pending, never gateway captured' USING ERRCODE='23514'; END IF;
 ELSE
   IF (NEW.order_id,NEW.shipment_id,NEW.order_revision_id,NEW.amount) IS DISTINCT FROM (OLD.order_id,OLD.shipment_id,OLD.order_revision_id,OLD.amount) THEN
     RAISE EXCEPTION 'COD cash identity is immutable' USING ERRCODE='23514'; END IF;
   IF NEW.status=OLD.status THEN RETURN NEW; END IF;
   IF OLD.status='pending' AND NEW.status='collected' THEN
     NEW.collected_at=clock_timestamp(); NEW.collected_by_user_id=actor;
   ELSIF OLD.status='collected' AND NEW.status='deposited' THEN
     NEW.deposited_at=clock_timestamp(); NEW.remitted_at=NEW.deposited_at;
   ELSIF OLD.status='deposited' AND NEW.status='settled' THEN NEW.settled_at=clock_timestamp();
   ELSE RAISE EXCEPTION 'Invalid COD collected/deposited/settled transition' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `payment.guard_intent_revision()`

```sql
CREATE OR REPLACE FUNCTION payment.guard_intent_revision()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE revision commerce.order_revisions; target_order commerce.orders;
BEGIN
 IF TG_OP='UPDATE' AND (NEW.order_id,NEW.order_revision_id,NEW.provider,NEW.provider_account_id,NEW.method,NEW.amount,NEW.currency,NEW.idempotency_key)
 IS DISTINCT FROM (OLD.order_id,OLD.order_revision_id,OLD.provider,OLD.provider_account_id,OLD.method,OLD.amount,OLD.currency,OLD.idempotency_key) THEN
   RAISE EXCEPTION 'Payment quote identity is immutable; initialize a new intent' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT target_order FROM commerce.orders WHERE id=NEW.order_id FOR UPDATE;
 IF TG_OP='INSERT' OR NEW.status IS DISTINCT FROM OLD.status OR NEW.amount IS DISTINCT FROM OLD.amount
 OR NEW.order_revision_id IS DISTINCT FROM OLD.order_revision_id THEN
   IF NEW.order_revision_id IS NULL THEN RAISE EXCEPTION 'New payment requires accepted revision' USING ERRCODE='23514'; END IF;
   SELECT * INTO STRICT revision FROM commerce.order_revisions WHERE id=NEW.order_revision_id FOR SHARE;
   IF revision.order_id<>NEW.order_id OR revision.status<>'accepted' OR revision.grand_total<>NEW.amount
   OR revision.currency<>NEW.currency OR target_order.status IN ('cancelled','closed') OR lower(NEW.method)='cod' THEN
     RAISE EXCEPTION 'Invalid or superseded payment quote; reconcile late events separately' USING ERRCODE='23514'; END IF;
   IF TG_OP='INSERT' AND EXISTS(SELECT 1 FROM commerce.order_items i WHERE i.order_id=NEW.order_id AND i.status NOT IN ('cancelled','rejected')
     AND (SELECT coalesce(sum(s.quantity),0) FROM warehouse.stock_reservations s WHERE s.order_item_id=i.id AND s.order_revision_id=NEW.order_revision_id
       AND s.status='active' AND s.expires_at>clock_timestamp())<i.quantity) THEN
     RAISE EXCEPTION 'Current revision stock must be held atomically before payment initialization' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `payment.guard_refund()`

```sql
CREATE OR REPLACE FUNCTION payment.guard_refund()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE captured payment.payment_transactions;
BEGIN
 IF TG_OP='UPDATE' AND OLD.status='succeeded' AND NEW IS DISTINCT FROM OLD THEN
   RAISE EXCEPTION 'Completed refund is immutable' USING ERRCODE='23514'; END IF;
 IF NEW.status IN ('cancelled','failed') THEN RETURN NEW; END IF;
 IF NEW.payment_transaction_id IS NULL THEN RAISE EXCEPTION 'Refund requires explicit captured transaction' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT captured FROM payment.payment_transactions WHERE id=NEW.payment_transaction_id FOR UPDATE;
 IF TG_OP='INSERT' THEN SELECT order_revision_id INTO NEW.order_revision_id FROM payment.payment_intents WHERE id=captured.payment_intent_id;
 ELSIF (NEW.order_id,NEW.payment_transaction_id,NEW.order_revision_id,NEW.amount) IS DISTINCT FROM (OLD.order_id,OLD.payment_transaction_id,OLD.order_revision_id,OLD.amount) THEN
   RAISE EXCEPTION 'Refund source and amount are immutable' USING ERRCODE='23514'; END IF;
 IF captured.status<>'succeeded' OR captured.transaction_type<>'capture'
 OR NOT EXISTS(SELECT 1 FROM payment.payment_intents WHERE id=captured.payment_intent_id AND order_id=NEW.order_id)
 OR NEW.amount+(SELECT coalesce(sum(amount),0) FROM payment.refunds WHERE payment_transaction_id=captured.id
   AND id<>NEW.id AND status NOT IN ('cancelled','failed'))>captured.amount THEN
   RAISE EXCEPTION 'Refund exceeds eligible capture or order mismatch' USING ERRCODE='23514'; END IF;
 IF NEW.status='succeeded' AND (SELECT coalesce(sum(amount),0) FROM payment.refund_allocations WHERE refund_id=NEW.id)<>NEW.amount THEN
   RAISE EXCEPTION 'Completed refund allocations must equal refund amount' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `payment.guard_refund_allocation()`

```sql
CREATE OR REPLACE FUNCTION payment.guard_refund_allocation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE refund payment.refunds; eligible_quantity numeric;
BEGIN
 SELECT * INTO STRICT refund FROM payment.refunds WHERE id=NEW.refund_id FOR UPDATE;
 -- Different refunds may target the same captured item. Serialize both the
 -- captured money and item before reading aggregate quantities.
 PERFORM 1 FROM payment.payment_transactions WHERE id=refund.payment_transaction_id FOR UPDATE;
 PERFORM 1 FROM commerce.order_items WHERE id=NEW.order_item_id FOR UPDATE;
 IF refund.status IN ('failed','cancelled','succeeded') THEN
   RAISE EXCEPTION 'Refund is not open for allocation' USING ERRCODE='23514'; END IF;
 NEW.order_revision_id=refund.order_revision_id;
 SELECT (line->>'quantity')::numeric INTO eligible_quantity FROM commerce.order_revisions r,
   LATERAL jsonb_array_elements(CASE WHEN jsonb_typeof(r.line_items_snapshot)='array' THEN r.line_items_snapshot ELSE '[]'::jsonb END) line
   WHERE r.id=refund.order_revision_id AND r.order_id=refund.order_id AND r.accepted_at IS NOT NULL
     AND line->>'id'=NEW.order_item_id::text;
 IF NEW.quantity IS NULL OR NEW.quantity<=0 OR NEW.quantity+(SELECT coalesce(sum(a.quantity),0) FROM payment.refund_allocations a
   JOIN payment.refunds r ON r.id=a.refund_id WHERE a.order_item_id=NEW.order_item_id AND r.status NOT IN ('failed','cancelled'))
   >eligible_quantity OR eligible_quantity IS NULL THEN
   RAISE EXCEPTION 'Refund item quantity exceeds eligible ordered quantity' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM commerce.order_items WHERE id=NEW.order_item_id AND order_id=refund.order_id)
 OR NEW.amount+(SELECT coalesce(sum(amount),0) FROM payment.refund_allocations WHERE refund_id=NEW.refund_id)>refund.amount THEN
   RAISE EXCEPTION 'Wrong order or excess refund allocation' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `payment.guard_transaction_quote()`

```sql
CREATE OR REPLACE FUNCTION payment.guard_transaction_quote()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE intent payment.payment_intents; revision commerce.order_revisions;
BEGIN
 SELECT * INTO STRICT intent FROM payment.payment_intents WHERE id=NEW.payment_intent_id FOR UPDATE;
 IF NEW.provider<>intent.provider OR NEW.transaction_type NOT IN ('authorization','capture','void','refund')
 OR NEW.status NOT IN ('pending','succeeded','failed') THEN
   RAISE EXCEPTION 'Unsupported gateway event requires explicit adapter/reconciliation' USING ERRCODE='23514'; END IF;
 PERFORM 1 FROM commerce.orders WHERE id=intent.order_id AND status NOT IN ('cancelled','closed') FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Late payment requires reconciliation' USING ERRCODE='23514'; END IF;
 SELECT * INTO revision FROM commerce.order_revisions WHERE id=intent.order_revision_id FOR SHARE;
 IF revision.id IS NULL OR revision.status<>'accepted' OR NEW.amount>intent.amount THEN
   RAISE EXCEPTION 'Capture against stale quote denied' USING ERRCODE='23514'; END IF;
 IF NEW.transaction_type='capture' AND NEW.status='succeeded' AND
   (SELECT coalesce(sum(t.amount),0) FROM payment.payment_transactions t JOIN payment.payment_intents i ON i.id=t.payment_intent_id
      WHERE i.order_id=intent.order_id AND t.transaction_type='capture' AND t.status='succeeded')+NEW.amount
    >revision.grand_total+(SELECT coalesce(sum(amount),0) FROM payment.refunds WHERE order_id=intent.order_id AND status='succeeded') THEN
   RAISE EXCEPTION 'Capture exceeds accepted amount' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `platform.authenticated_customer()`

```sql
CREATE OR REPLACE FUNCTION platform.authenticated_customer()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
 SELECT u.id FROM identity.users u WHERE u.id=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid AND u.status='active'
$function$
```

### `platform.can_read_warehouse(target_warehouse uuid)`

```sql
CREATE OR REPLACE FUNCTION platform.can_read_warehouse(target_warehouse uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
 SELECT EXISTS(SELECT 1 FROM identity.users u JOIN identity.user_roles ur ON ur.user_id=u.id
  JOIN identity.roles r ON r.id=ur.role_id JOIN identity.role_permissions rp ON rp.role_id=r.id
  JOIN identity.permissions p ON p.id=rp.permission_id
  WHERE u.id=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid AND u.status='active'
   AND ur.is_active AND NOT r.is_deleted AND NOT p.is_deleted AND p.code='inventory.read'
   AND (ur.valid_from IS NULL OR ur.valid_from<=now()) AND (ur.valid_until IS NULL OR ur.valid_until>now())
   AND ((ur.scope_type IS NULL AND ur.scope_id IS NULL) OR (ur.scope_type='warehouse' AND ur.scope_id=target_warehouse)))
$function$
```

### `platform.deny_mutation()`

```sql
CREATE OR REPLACE FUNCTION platform.deny_mutation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF TG_OP='DELETE' AND TG_TABLE_SCHEMA='logistics' AND TG_TABLE_NAME='delivery_location_updates'
 AND current_setting('pharmville.retention_purge',true)='approved' THEN
   PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'logistics.retention');
   IF EXISTS(SELECT 1 FROM platform.application_settings p WHERE namespace='pharmville' AND key='rider_gps_policy' AND NOT is_deleted
     AND value->>'approved'='true' AND value->>'legal_hold'='false' AND (value->>'retention_days')::int>0
     AND OLD.received_at<clock_timestamp()-make_interval(days=>(value->>'retention_days')::int))
   AND EXISTS(SELECT 1 FROM logistics.delivery_assignments WHERE id=OLD.assignment_id AND NOT is_current) THEN RETURN OLD; END IF;
 END IF;
 RAISE EXCEPTION 'Append-only history cannot be changed' USING ERRCODE='23514';
END $function$
```

### `platform.guard_cms_publication()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_cms_publication()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF NEW.status='published' THEN
   PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'cms.publish');
   IF NOT EXISTS(SELECT 1 FROM platform.cms_page_versions v WHERE v.page_id=NEW.id AND v.published_at IS NOT NULL AND v.approved_by_user_id IS NOT NULL) THEN
     RAISE EXCEPTION 'Published page requires an approved published version' USING ERRCODE='23514'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `platform.guard_master()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_master()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE actor uuid;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Reference codes are retained; deactivate instead' USING ERRCODE='23514'; END IF;
 actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
 PERFORM platform.require_permission(actor,'masters.manage');
 IF TG_OP='UPDATE' AND (NEW.code,NEW.created_by_user_id) IS DISTINCT FROM (OLD.code,OLD.created_by_user_id) THEN
   RAISE EXCEPTION 'Master code and creator are immutable' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' THEN NEW.created_by_user_id=actor; END IF;
 NEW.updated_by_user_id=actor;
 INSERT INTO platform.audit_logs(actor_user_id,actor_type,action,resource_type,resource_id,after_data)
 VALUES(actor,'staff','master_changed',TG_TABLE_SCHEMA||'.'||TG_TABLE_NAME,NEW.id::text,
   jsonb_build_object('code',NEW.code,'is_active',NEW.is_active));
 RETURN NEW;
END $function$
```

### `platform.guard_published_version()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_published_version()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF TG_OP<>'INSERT' AND OLD.published_at IS NOT NULL THEN
   RAISE EXCEPTION 'Published CMS version is immutable' USING ERRCODE='23514'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 IF NEW.published_at IS NOT NULL THEN PERFORM platform.require_permission(NEW.approved_by_user_id,'cms.publish'); END IF;
 RETURN NEW;
END $function$
```

### `platform.guard_report_definition()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_report_definition()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 PERFORM platform.require_permission(nullif(current_setting('pharmville.actor_user_id',true),'')::uuid,'masters.manage');
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Deactivate report definitions; preserve execution history' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' AND NEW.code<>OLD.code THEN RAISE EXCEPTION 'Controlled report code is immutable' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `platform.guard_report_run()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_report_run()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE definition platform.report_definitions; actor uuid;
BEGIN
 actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
 SELECT * INTO STRICT definition FROM platform.report_definitions WHERE id=NEW.definition_id FOR SHARE;
 IF TG_OP='INSERT' THEN
   IF actor IS DISTINCT FROM NEW.requested_by_user_id OR NOT definition.is_active OR definition.data_classification IS NULL OR NEW.status<>'queued'
   OR NOT EXISTS(SELECT 1 FROM identity.user_roles ur JOIN identity.roles r ON r.id=ur.role_id JOIN identity.users u ON u.id=ur.user_id
      WHERE ur.user_id=actor AND u.status='active' AND ur.is_active AND NOT r.is_deleted AND r.code=definition.owner_role
        AND ur.scope_type IS NULL AND ur.scope_id IS NULL AND (ur.valid_from IS NULL OR ur.valid_from<=now()) AND (ur.valid_until IS NULL OR ur.valid_until>now()))
   THEN RAISE EXCEPTION 'Approved report and authorized requester role required' USING ERRCODE='42501'; END IF;
 ELSE
   PERFORM platform.require_permission(actor,'reports.execute');
   IF (NEW.definition_id,NEW.requested_by_user_id,NEW.parameters,NEW.requested_at) IS DISTINCT FROM (OLD.definition_id,OLD.requested_by_user_id,OLD.parameters,OLD.requested_at)
   OR OLD.status IN ('failed','expired') OR OLD.status='succeeded' AND NEW.status<>'expired'
   OR NEW.status<>OLD.status AND NOT (OLD.status='queued' AND NEW.status IN ('running','failed') OR OLD.status='running' AND NEW.status IN ('succeeded','failed') OR OLD.status='succeeded' AND NEW.status='expired') THEN
     RAISE EXCEPTION 'Invalid report transition or immutable execution change' USING ERRCODE='23514'; END IF;
 END IF;
 IF definition.data_classification='health' THEN PERFORM platform.require_permission(actor,'reports.health_export'); END IF;
 IF NEW.status='running' THEN NEW.started_at=clock_timestamp(); END IF;
 IF NEW.status='succeeded' THEN
   IF definition.export_ttl_seconds IS NULL OR NEW.result_expires_at IS NULL OR NEW.result_expires_at<=clock_timestamp()
   OR NEW.result_expires_at>clock_timestamp()+make_interval(secs=>definition.export_ttl_seconds)
   OR NOT EXISTS(SELECT 1 FROM platform.file_objects f WHERE f.id=NEW.result_file_object_id AND f.access_type='private' AND f.status='available'
     AND f.malware_scan_status='clean' AND NOT f.is_deleted AND f.owner_type='report' AND f.owner_id=NEW.id) THEN
     RAISE EXCEPTION 'Safe private report export with approved TTL/ownership required' USING ERRCODE='23514'; END IF;
   NEW.finished_at=clock_timestamp();
 END IF;
 RETURN NEW;
END $function$
```

### `platform.guard_reviewed_file_identity()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_reviewed_file_identity()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF EXISTS(SELECT 1 FROM clinical.prescription_documents d JOIN clinical.order_reviews r ON r.prescription_document_id=d.id
     WHERE d.file_object_id=OLD.id)
 AND (NEW.storage_provider,NEW.bucket,NEW.object_key,NEW.sha256,NEW.storage_version_id,NEW.size_bytes)
 IS DISTINCT FROM (OLD.storage_provider,OLD.bucket,OLD.object_key,OLD.sha256,OLD.storage_version_id,OLD.size_bytes) THEN
   RAISE EXCEPTION 'Reviewed prescription file identity is immutable' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `platform.guard_stable_code()`

```sql
CREATE OR REPLACE FUNCTION platform.guard_stable_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE entry text; data jsonb=to_jsonb(NEW); prior jsonb; duplicate boolean; predicate text=''; identifier text=TG_ARGV[0];
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Stable master history is retained; deactivate instead' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' THEN
   prior=to_jsonb(OLD);
   IF data->identifier IS DISTINCT FROM prior->identifier THEN RAISE EXCEPTION 'Master identifiers are immutable' USING ERRCODE='23514'; END IF;
 END IF;
 FOR entry IN SELECT jsonb_array_elements_text(TG_ARGV[1]::jsonb) LOOP
   IF TG_OP='UPDATE' AND data->entry IS DISTINCT FROM prior->entry THEN RAISE EXCEPTION 'Master code scope is immutable' USING ERRCODE='23514'; END IF;
   predicate=predicate||format(' AND to_jsonb(t)->%L IS NOT DISTINCT FROM $2->%L',entry,entry);
 END LOOP;
 IF TG_OP='INSERT' THEN
   PERFORM pg_advisory_xact_lock(hashtextextended(TG_TABLE_SCHEMA||'.'||TG_TABLE_NAME||':'||(data->>identifier),0));
   EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I.%I t WHERE %I=$1 %s)',TG_TABLE_SCHEMA,TG_TABLE_NAME,identifier,predicate) INTO duplicate USING data->>identifier,data;
   IF duplicate THEN RAISE EXCEPTION 'Master code reserved by existing history' USING ERRCODE='23505'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `platform.maintain_internal_keys()`

```sql
CREATE OR REPLACE FUNCTION platform.maintain_internal_keys()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE data jsonb=to_jsonb(NEW); prior jsonb; link jsonb;
 source_name text; numeric_name text; source_changed boolean; numeric_changed boolean;
 public_value uuid; numeric_value bigint; resolved_uuid uuid; resolved_numeric bigint;
BEGIN
 IF TG_OP='UPDATE' THEN
   prior=to_jsonb(OLD);
   IF data->TG_ARGV[1] IS DISTINCT FROM prior->TG_ARGV[1]
     OR TG_ARGV[2]<>'' AND data->TG_ARGV[2] IS DISTINCT FROM prior->TG_ARGV[2] THEN
     RAISE EXCEPTION 'Storage and public identities are immutable' USING ERRCODE='23514'; END IF;
 END IF;
 FOR link IN SELECT * FROM jsonb_array_elements(TG_ARGV[0]::jsonb) LOOP
   source_name=link->>0; numeric_name=link->>1;
   source_changed=TG_OP='INSERT' OR data->source_name IS DISTINCT FROM prior->source_name;
   numeric_changed=TG_OP='INSERT' OR data->numeric_name IS DISTINCT FROM prior->numeric_name;
   IF TG_OP='UPDATE' AND NOT source_changed AND NOT numeric_changed THEN CONTINUE; END IF;
   public_value=nullif(data->>source_name,'')::uuid;
   numeric_value=nullif(data->>numeric_name,'')::bigint;
   IF TG_OP='UPDATE' AND numeric_changed AND NOT source_changed OR TG_OP='INSERT' AND public_value IS NULL AND numeric_value IS NOT NULL THEN
     IF numeric_value IS NULL THEN
       data=jsonb_set(data,ARRAY[source_name],'null'::jsonb);
     ELSE
       EXECUTE format('SELECT id FROM %I.%I WHERE internal_id=$1',link->>2,link->>3) INTO resolved_uuid USING numeric_value;
       IF resolved_uuid IS NULL THEN RAISE EXCEPTION 'Unknown numeric entity reference' USING ERRCODE='23503'; END IF;
       data=jsonb_set(data,ARRAY[source_name],to_jsonb(resolved_uuid));
     END IF;
   ELSIF public_value IS NULL THEN
     IF TG_OP='UPDATE' AND source_changed AND numeric_changed AND numeric_value IS NOT NULL THEN
       RAISE EXCEPTION 'Conflicting public/numeric reference' USING ERRCODE='23503'; END IF;
     data=jsonb_set(data,ARRAY[numeric_name],'null'::jsonb);
   ELSE
     EXECUTE format('SELECT internal_id FROM %I.%I WHERE id=$1',link->>2,link->>3) INTO resolved_numeric USING public_value;
     IF resolved_numeric IS NULL THEN RAISE EXCEPTION 'Unknown public entity reference' USING ERRCODE='23503'; END IF;
     IF numeric_value IS NOT NULL AND numeric_value<>resolved_numeric AND (TG_OP='INSERT' OR numeric_changed) THEN
       RAISE EXCEPTION 'Conflicting public/numeric reference' USING ERRCODE='23503'; END IF;
     data=jsonb_set(data,ARRAY[numeric_name],to_jsonb(resolved_numeric));
   END IF;
 END LOOP;
 NEW=jsonb_populate_record(NEW,data);
 RETURN NEW;
END $function$
```

### `platform.maintain_record()`

```sql
CREATE OR REPLACE FUNCTION platform.maintain_record()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
 NEW.updated_at=clock_timestamp();
 IF TG_ARGV[0]='versioned' THEN
   IF NEW.row_version=OLD.row_version THEN NEW.row_version=OLD.row_version+1;
   ELSIF NEW.row_version<>OLD.row_version+1 THEN RAISE EXCEPTION 'Invalid row version increment' USING ERRCODE='40001'; END IF;
 END IF;
 RETURN NEW;
END $function$
```

### `platform.normalize_reason()`

```sql
CREATE OR REPLACE FUNCTION platform.normalize_reason()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE chosen_id bigint; chosen_code text; active boolean;
BEGIN
 IF TG_OP='UPDATE' AND (NEW.reason_code,NEW.reason_code_id) IS NOT DISTINCT FROM (OLD.reason_code,OLD.reason_code_id) THEN RETURN NEW; END IF;
 IF NEW.reason_code IS NULL AND NEW.reason_code_id IS NULL THEN RETURN NEW; END IF;
 IF NEW.reason_code_id IS NULL THEN
   EXECUTE format('SELECT id,code,is_active FROM %I.%I WHERE code=$1',split_part(TG_ARGV[0],'.',1),split_part(TG_ARGV[0],'.',2))
     INTO chosen_id,chosen_code,active USING NEW.reason_code;
 ELSE
   EXECUTE format('SELECT id,code,is_active FROM %I.%I WHERE id=$1',split_part(TG_ARGV[0],'.',1),split_part(TG_ARGV[0],'.',2))
     INTO chosen_id,chosen_code,active USING NEW.reason_code_id;
 END IF;
 IF chosen_id IS NULL OR NOT active OR NEW.reason_code IS NOT NULL AND NEW.reason_code<>chosen_code THEN
   RAISE EXCEPTION 'Active approved reason choice required; no historical codes fabricated' USING ERRCODE='23503'; END IF;
 NEW.reason_code_id=chosen_id; NEW.reason_code=chosen_code;
 RETURN NEW;
END $function$
```

### `platform.require_permission(actor uuid, permission_code text)`

```sql
CREATE OR REPLACE FUNCTION platform.require_permission(actor uuid, permission_code text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF actor IS NULL OR actor::text IS DISTINCT FROM current_setting('pharmville.actor_user_id',true)
 OR NOT EXISTS (
   SELECT 1 FROM identity.users u
   JOIN identity.user_roles ur ON ur.user_id=u.id
   JOIN identity.roles r ON r.id=ur.role_id
   JOIN identity.role_permissions rp ON rp.role_id=r.id
   JOIN identity.permissions p ON p.id=rp.permission_id
   WHERE u.id=actor AND u.status='active' AND ur.is_active
     AND NOT r.is_deleted AND NOT p.is_deleted AND p.code=permission_code
     AND ur.scope_type IS NULL AND ur.scope_id IS NULL
     AND (ur.valid_from IS NULL OR ur.valid_from<=now())
     AND (ur.valid_until IS NULL OR ur.valid_until>now())
 ) THEN RAISE EXCEPTION 'Permission denied' USING ERRCODE='42501'; END IF;
END $function$
```

### `warehouse.assert_authorized_location(target_warehouse uuid, target_seller uuid)`

```sql
CREATE OR REPLACE FUNCTION warehouse.assert_authorized_location(target_warehouse uuid, target_seller uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE policy jsonb;
BEGIN
 policy=warehouse.fulfillment_policy();
 IF NOT EXISTS(SELECT 1 FROM warehouse.warehouses w
  JOIN organization.organizations org ON org.id=w.organization_id
  JOIN organization.locations loc ON loc.id=w.location_id AND loc.organization_id=w.organization_id
  JOIN marketplace.seller_locations sl ON sl.warehouse_id=w.id AND sl.location_id=w.location_id
  JOIN marketplace.sellers s ON s.id=sl.seller_id AND s.organization_id=w.organization_id
  JOIN organization.licenses license ON license.id=sl.license_id AND license.organization_id=w.organization_id AND license.location_id=w.location_id
  WHERE w.id=target_warehouse AND (target_seller IS NULL OR s.id=target_seller)
   AND w.status='active' AND NOT w.is_deleted AND org.status='active' AND NOT org.is_deleted
   AND loc.is_active AND NOT loc.is_deleted AND s.is_active AND s.status='active' AND s.verification_status='verified' AND NOT s.is_deleted
   AND sl.is_active AND sl.authorization_status='approved' AND sl.approved_by_user_id IS NOT NULL AND sl.approved_at IS NOT NULL AND length(btrim(sl.approval_evidence))>0
   AND NOT license.is_deleted AND license.verification_status='verified'
   AND license.issued_at IS NOT NULL AND license.issued_at<=current_date AND license.expires_at IS NOT NULL AND license.expires_at>=current_date
   AND policy->'allowed_license_types' ? license.license_type) THEN
   RAISE EXCEPTION 'Unlicensed, unauthorized or cross-organization fulfillment location' USING ERRCODE='23514'; END IF;
END $function$
```

### `warehouse.fulfillment_policy()`

```sql
CREATE OR REPLACE FUNCTION warehouse.fulfillment_policy()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE policy jsonb;
BEGIN
 SELECT value INTO policy FROM platform.application_settings WHERE namespace='pharmville' AND key='fulfillment_policy' AND NOT is_deleted;
 IF NOT coalesce(jsonb_typeof(policy->'approved')='boolean' AND policy->>'approved'='true'
   AND jsonb_typeof(policy->'allowed_license_types')='array' AND jsonb_array_length(policy->'allowed_license_types')>0
   AND jsonb_typeof(policy->'inventory_max_age_seconds')='number' AND policy->>'inventory_max_age_seconds' ~ '^[1-9][0-9]*$',false) THEN
   RAISE EXCEPTION 'Fulfillment disabled until license and inventory policy is approved' USING ERRCODE='23514'; END IF;
 RETURN policy;
END $function$
```

### `warehouse.guard_fulfillment_reservation()`

```sql
CREATE OR REPLACE FUNCTION warehouse.guard_fulfillment_reservation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE policy jsonb; observed timestamptz;
BEGIN
 IF TG_OP='UPDATE' AND NEW.status NOT IN ('active','committed') THEN RETURN NEW; END IF;
 IF TG_OP='UPDATE' AND NEW.status=OLD.status THEN RETURN NEW; END IF;
 PERFORM 1 FROM commerce.orders WHERE id=NEW.order_id FOR UPDATE;
 PERFORM warehouse.assert_authorized_location(NEW.warehouse_id);
 policy=warehouse.fulfillment_policy();
 SELECT inventory_observed_at INTO observed FROM warehouse.stock_balances WHERE warehouse_id=NEW.warehouse_id AND bin_id=NEW.bin_id AND lot_id=NEW.lot_id FOR UPDATE;
 IF observed IS NULL OR observed>clock_timestamp() OR observed<clock_timestamp()-make_interval(secs=>(policy->>'inventory_max_age_seconds')::double precision) THEN
   RAISE EXCEPTION 'Inventory is stale or unconfirmed; reconciliation required' USING ERRCODE='23514'; END IF;
 IF EXISTS(SELECT 1 FROM warehouse.stock_reservations r WHERE r.order_id=NEW.order_id AND r.id<>NEW.id AND r.status IN ('active','committed') AND r.warehouse_id<>NEW.warehouse_id) THEN
   RAISE EXCEPTION 'Phase-one orders use a single authorized fulfillment location' USING ERRCODE='23514'; END IF;
 RETURN NEW;
END $function$
```

### `warehouse.guard_inventory_observation()`

```sql
CREATE OR REPLACE FUNCTION warehouse.guard_inventory_observation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE actor uuid;
BEGIN
 IF (TG_OP='INSERT' AND NEW.inventory_observed_at IS NOT NULL) OR TG_OP='UPDATE' AND
  (NEW.inventory_observed_at,NEW.inventory_source,NEW.inventory_observed_by_user_id) IS DISTINCT FROM (OLD.inventory_observed_at,OLD.inventory_source,OLD.inventory_observed_by_user_id) THEN
  actor=nullif(current_setting('pharmville.actor_user_id',true),'')::uuid;
  PERFORM platform.require_permission(actor,'inventory.confirm');
  IF NEW.inventory_observed_at IS NULL OR NEW.inventory_observed_at>clock_timestamp() OR length(btrim(coalesce(NEW.inventory_source,'')))=0
    OR TG_OP='UPDATE' AND NEW.inventory_observed_at<OLD.inventory_observed_at THEN
   RAISE EXCEPTION 'Monotonic, non-future inventory observation and source required' USING ERRCODE='23514'; END IF;
  NEW.inventory_observed_by_user_id=actor;
  INSERT INTO platform.audit_logs(actor_user_id,actor_type,action,resource_type,resource_id,after_data)
   VALUES(actor,'integration','inventory_observed','stock_balance',NEW.id::text,jsonb_build_object('source',NEW.inventory_source));
 END IF;
 RETURN NEW;
END $function$
```

### `warehouse.guard_reservation()`

```sql
CREATE OR REPLACE FUNCTION warehouse.guard_reservation()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE lot warehouse.inventory_lots; item commerce.order_items; balance warehouse.stock_balances;
        movement text; delta numeric;
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'Retain reservation history' USING ERRCODE='23514'; END IF;
 SELECT * INTO STRICT item FROM commerce.order_items WHERE id=NEW.order_item_id FOR UPDATE;
 SELECT * INTO STRICT lot FROM warehouse.inventory_lots WHERE id=NEW.lot_id FOR SHARE;
 SELECT * INTO STRICT balance FROM warehouse.stock_balances WHERE lot_id=NEW.lot_id
   AND bin_id=NEW.bin_id AND warehouse_id=NEW.warehouse_id FOR UPDATE;
 IF NEW.order_revision_id IS NOT NULL AND (TG_OP='INSERT' OR NEW.status='committed' OR TG_OP='UPDATE' AND OLD.order_revision_id IS NULL)
 AND NOT EXISTS(SELECT 1 FROM commerce.order_revisions r,
   LATERAL jsonb_array_elements(r.line_items_snapshot) line WHERE r.id=NEW.order_revision_id AND r.order_id=NEW.order_id
   AND r.status IN ('proposed','accepted') AND line->>'id'=NEW.order_item_id::text AND line->>'quantity'=item.quantity::text) THEN
   RAISE EXCEPTION 'Reservation does not belong to the quoted basket version' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' AND OLD.order_revision_id IS NOT NULL AND NEW.order_revision_id IS DISTINCT FROM OLD.order_revision_id THEN
   RAISE EXCEPTION 'Reservation quote identity is immutable' USING ERRCODE='23514'; END IF;
 IF NOT EXISTS(SELECT 1 FROM warehouse.bins WHERE id=NEW.bin_id AND warehouse_id=NEW.warehouse_id) THEN
   RAISE EXCEPTION 'Reservation bin/warehouse mismatch' USING ERRCODE='23514'; END IF;
 IF TG_OP='INSERT' THEN
   PERFORM catalog.assert_sellable(item.product_id,item.quantity);
   IF NEW.status<>'active' OR NEW.expires_at<=clock_timestamp() OR item.order_id<>NEW.order_id OR NEW.quantity::text='NaN'
   OR item.product_id<>lot.product_id OR item.variant_id IS DISTINCT FROM lot.variant_id
   OR lot.warehouse_id<>NEW.warehouse_id OR lot.quality_status<>'approved' OR lot.recall_status<>'clear'
   OR lot.expires_at<=current_date OR item.status IN ('cancelled','rejected')
   OR EXISTS(SELECT 1 FROM warehouse.stock_holds WHERE lot_id=lot.id AND status='active')
   OR balance.on_hand_qty-balance.reserved_qty-balance.damaged_qty-balance.quarantined_qty<NEW.quantity
   OR NEW.quantity+(SELECT coalesce(sum(quantity),0) FROM warehouse.stock_reservations WHERE order_item_id=item.id AND status IN ('active','committed'))>item.quantity THEN
     RAISE EXCEPTION 'Insufficient or unsafe stock reservation' USING ERRCODE='23514'; END IF;
   UPDATE warehouse.stock_balances SET reserved_qty=reserved_qty+NEW.quantity,row_version=row_version+1,updated_at=now() WHERE id=balance.id;
   movement='reserve'; delta=NEW.quantity;
 ELSE
   IF (NEW.order_id,NEW.order_item_id,NEW.warehouse_id,NEW.bin_id,NEW.lot_id,NEW.quantity,NEW.expires_at)
   IS DISTINCT FROM (OLD.order_id,OLD.order_item_id,OLD.warehouse_id,OLD.bin_id,OLD.lot_id,OLD.quantity,OLD.expires_at) THEN
     RAISE EXCEPTION 'Reservation identity/quantity is immutable' USING ERRCODE='23514'; END IF;
   IF NEW.status=OLD.status THEN RETURN NEW; END IF;
   IF OLD.status<>'active' OR NEW.status NOT IN ('committed','released','expired','cancelled') THEN
     RAISE EXCEPTION 'Invalid reservation transition' USING ERRCODE='23514'; END IF;
   IF NEW.status='committed' THEN
     PERFORM clinical.assert_dispatchable(item.id);
     IF NEW.expires_at<=now() OR lot.expires_at<=current_date OR lot.quality_status<>'approved' OR lot.recall_status<>'clear'
     OR EXISTS(SELECT 1 FROM warehouse.stock_holds WHERE lot_id=lot.id AND status='active') THEN
       RAISE EXCEPTION 'Expired or unsafe reservation cannot commit' USING ERRCODE='23514'; END IF;
     UPDATE warehouse.stock_balances SET on_hand_qty=on_hand_qty-NEW.quantity,reserved_qty=reserved_qty-NEW.quantity,
       updated_at=now(),row_version=row_version+1 WHERE id=balance.id;
     NEW.committed_at=now(); movement='commit'; delta=-NEW.quantity;
   ELSE
     IF NEW.status='expired' AND NEW.expires_at>now() THEN RAISE EXCEPTION 'Reservation has not expired' USING ERRCODE='23514'; END IF;
     UPDATE warehouse.stock_balances SET reserved_qty=reserved_qty-NEW.quantity,updated_at=now(),row_version=row_version+1 WHERE id=balance.id;
     NEW.released_at=now(); movement='release'; delta=-NEW.quantity;
   END IF;
 END IF;
 INSERT INTO warehouse.stock_ledger(warehouse_id,bin_id,lot_id,movement_type,quantity,reference_type,reference_id,idempotency_key)
 VALUES(NEW.warehouse_id,NEW.bin_id,NEW.lot_id,movement,delta,'reservation',NEW.id,'reservation:'||NEW.id||':'||movement);
 RETURN NEW;
END $function$
```
