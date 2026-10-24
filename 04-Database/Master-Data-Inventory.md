# Master-data inventory and initial records

**Planning status: Proposed / Unapproved.** Classification uses the table’s role, relationships and lifecycle; no seed/migration changes. All 266 checked-in table pages were inspected. SQL source and live data are unavailable in this checkout, so Confirmed means documented domain/CHECK evidence, not observed rows. [API coverage](../05-APIs/API-Contract-Coverage.md) · [decisions](../05-APIs/Planning-Decisions.md).

## Classification totals

| Classification | Tables | Meaning |
| --- | --- | --- |
| Audit / History | 28 | Append-only or versioned event/evidence history. |
| Configuration | 41 | Policy, credentials or behavior setup; naming alone does not make a master. |
| Derived / Operational | 17 | Read model, queue, coordination record or operational artifact. |
| Mapping / Junction | 30 | Association between independently owned identities. |
| Master / Reference | 44 | Reusable party/product/reference identity; not an occurrence. |
| Transactional | 106 | Business occurrence or aggregate with state/quantity/financial lifecycle. |

Identified masters: **44**. Masters with explicit Confirmed/Proposed initial-value lists: **11**; remaining **33 Open**. Operational party/product masters deliberately require real owner records rather than fictional deployment seed data. All 266 tables are classified; Requires Classification: 0 (classifications remain review proposals).

## Master register

| Master table | Business purpose | Owner/steward | Initial records | Consuming APIs |
| --- | --- | --- | --- | --- |
| [`appointment.service_types`](Tables/appointment/service_types.md) | Service offerings and duration/payment/prescription configuration | Future appointments / Scheduling administrator | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`catalog.brands`](Tables/catalog/brands.md) | Reusable brand identity | Product_Catalog / Catalog Manager | Open — owner dataset required | API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-043, API-048, API-052, ACC-ROUTE-008, ACC-ROUTE-009 |
| [`catalog.categories`](Tables/catalog/categories.md) | Customer browse taxonomy and hierarchy | Product_Catalog / Catalog Manager | Confirmed/Proposed list (3 rows) | API-010, API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-043, API-048, API-052, ACC-ROUTE-008, ACC-ROUTE-009 |
| [`catalog.commerce_classes`](Tables/catalog/commerce_classes.md) | Controlled P/M/O commerce eligibility | Product_Catalog / Catalog classification approver with Pharmacy validation | Confirmed/Proposed list (3 rows) | API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-024, API-026, API-027, API-028, API-040, API-041, API-042, API-043, API-047, API-048, API-052, API-062, API-063, ACC-ROUTE-008, ACC-ROUTE-009 |
| [`catalog.dosage_forms`](Tables/catalog/dosage_forms.md) | Approved medicine dosage-form reference | Product_Catalog / Pharmacy-approved Catalog steward | Open — owner dataset required | API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-043, API-048, API-052, ACC-ROUTE-008, ACC-ROUTE-009 |
| [`catalog.manufacturers`](Tables/catalog/manufacturers.md) | Verified manufacturing legal parties | Product_Catalog / Catalog steward | Open — owner dataset required | API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-043, API-048, API-052, ACC-ROUTE-008, ACC-ROUTE-009 |
| [`catalog.product_variants`](Tables/catalog/product_variants.md) | Distinct sellable pack/variant identities | Product_Catalog / Catalog Manager | Open — owner dataset required | API-012, API-014, API-015, API-017, API-018, API-019, API-020, API-021, API-024, API-026, API-027, API-028, API-040, API-041, API-042, API-043, API-046, API-047, API-048, API-049, API-050, API-051, API-052, API-054, API-055, API-056, API-057, API-058, API-062, API-063, API-084 |
| [`catalog.products`](Tables/catalog/products.md) | Stable sellable product identities and approved classifications | Product_Catalog / Catalog Manager | Open — owner dataset required | API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-024, API-026, API-027, API-028, API-040, API-041, API-042, API-043, API-046, API-047, API-048, API-049, API-050, API-051, API-052, API-054, API-055, API-056, API-057, API-058, API-062, API-063, API-084, ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`catalog.salts`](Tables/catalog/salts.md) | Approved medicine composition reference | Product_Catalog / Pharmacy-approved Catalog steward | Open — owner dataset required | API-012, API-013 |
| [`catalog.substitution_groups`](Tables/catalog/substitution_groups.md) | Approved equivalence group reference; no automatic substitution permission | Product_Catalog / Pharmacist | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`catalog.units_of_measure`](Tables/catalog/units_of_measure.md) | Reusable measurement dimensions and base conversion | Product_Catalog / Catalog steward | Confirmed/Proposed list (1 rows) | No current operation; future/operational maintenance scope |
| [`clinical.patient_profiles`](Tables/clinical/patient_profiles.md) | Stable protected patient identity, not clinical event history | Prescription_Upload / Intake and Privacy owner | Open — owner dataset required | API-007, API-008, API-020, API-021, API-024, API-025, API-026, API-027, API-028, API-029, API-030, API-031, API-032, API-039, API-040, API-041, API-042, API-043, API-045, API-046, API-047, API-052, API-059, API-060, API-061, API-062, API-063, API-071, API-073, API-075, API-076, API-077, API-078, API-081, API-082, API-083, API-094, API-095, ACC-ROUTE-003, ACC-ROUTE-004 |
| [`clinical.practitioner_profiles`](Tables/clinical/practitioner_profiles.md) | Verified practitioner identity and qualifications | Pharmacist_Review / Credentialing administrator | Open — owner dataset required | API-060, API-062 |
| [`clinical.review_reason_codes`](Tables/clinical/review_reason_codes.md) | Controlled clinical review outcome reasons | Pharmacist_Review / Pharmacy clinical policy owner | Open — owner dataset required | API-032, API-041, API-042, API-045, API-046, API-047, API-052, API-060, API-061, API-062, API-063, API-071, API-075 |
| [`commerce.cancellation_reason_codes`](Tables/commerce/cancellation_reason_codes.md) | Controlled customer/operations cancellation reasons | Order_Operations / Operations policy steward | Confirmed/Proposed list (2 rows) | API-027 |
| [`commerce.return_reason_codes`](Tables/commerce/return_reason_codes.md) | Controlled return request reasons | Order_Operations / Operations policy steward with Pharmacy validation | Confirmed/Proposed list (2 rows) | API-028 |
| [`compliance.regulatory_authorities`](Tables/compliance/regulatory_authorities.md) | Authoritative regulatory-body identities referenced by verification records | Admin_CMS via Compliance owner / Compliance and Legal steward | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`customer.profiles`](Tables/customer/profiles.md) | Customer demographic master separated from identity credentials | Customer_Accounts / Customer self-service / Customer Accounts | Open — owner dataset required | API-002, API-003, API-004, API-006, ACC-ROUTE-001, ACC-ROUTE-002 |
| [`diagnostics.lab_providers`](Tables/diagnostics/lab_providers.md) | Verified diagnostic lab provider parties | Future diagnostics / Diagnostic credentialing owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`diagnostics.test_definitions`](Tables/diagnostics/test_definitions.md) | Approved diagnostic service definitions | Future diagnostics / Clinical diagnostics owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`diagnostics.test_packages`](Tables/diagnostics/test_packages.md) | Approved diagnostic service bundles | Future diagnostics / Clinical diagnostics owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`finance.accounts`](Tables/finance/accounts.md) | Chart-of-accounts identities used by journal lines | Finance_Payments / Finance accounting owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`identity.permissions`](Tables/identity/permissions.md) | Action/resource grant vocabulary | Authentication_Access / Security administrator | Confirmed/Proposed list (71 rows) | API-003, API-004, API-005, API-006, API-007, API-008, API-009, ACC-ROUTE-005, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-022, API-023, API-024, API-025, API-026, API-027, API-028, API-029, API-030, API-031, API-032, API-033, API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041, API-042, API-043, API-044, API-045, API-046, API-047, API-048, API-049, API-050, API-051, API-052, API-053, API-054, API-055, API-056, API-057, API-058, API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066, API-067, API-068, API-069, API-070, API-071, API-072, API-073, API-074, API-075, API-077, API-078, API-079, API-080, API-081, API-082, API-083, API-084, API-085, API-086, API-087, API-088, API-091, API-092, API-093, API-094, API-095, API-096, API-097, ACC-ROUTE-001, ACC-ROUTE-002, ACC-ROUTE-007, ACC-ROUTE-006, ACC-ROUTE-003, ACC-ROUTE-004, ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`identity.roles`](Tables/identity/roles.md) | Business role identities, separate from PostgreSQL runtime roles | Authentication_Access / Security administrator | Confirmed/Proposed list (16 rows) | API-003, API-004, API-005, API-006, API-007, API-008, API-009, ACC-ROUTE-005, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-022, API-023, API-024, API-025, API-026, API-027, API-028, API-029, API-030, API-031, API-032, API-033, API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041, API-042, API-043, API-044, API-045, API-046, API-047, API-048, API-049, API-050, API-051, API-052, API-053, API-054, API-055, API-056, API-057, API-058, API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066, API-067, API-068, API-069, API-070, API-071, API-072, API-073, API-074, API-075, API-077, API-078, API-079, API-080, API-081, API-082, API-083, API-084, API-085, API-086, API-087, API-088, API-089, API-090, API-091, API-092, API-093, API-094, API-095, API-096, API-097, ACC-ROUTE-001, ACC-ROUTE-002, ACC-ROUTE-007, ACC-ROUTE-006, ACC-ROUTE-003, ACC-ROUTE-004, ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`identity.user_profiles`](Tables/identity/user_profiles.md) | Staff/general identity display-profile companion | Authentication_Access / Identity administrator / own-profile owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`identity.users`](Tables/identity/users.md) | Stable identity account master; credentials are protected attributes | Authentication_Access / Identity administrator / verified onboarding | Open — owner dataset required | API-001, API-002, API-003, API-004, API-005, API-006, API-007, API-008, API-009, ACC-ROUTE-005, API-010, API-011, API-012, API-013, API-014, API-015, API-016, API-017, API-018, API-019, API-020, API-021, API-022, API-023, API-024, API-025, API-026, API-027, API-028, API-029, API-030, API-031, API-032, API-033, API-034, API-035, API-036, API-037, API-038, API-039, API-040, API-041, API-042, API-043, API-044, API-045, API-046, API-047, API-048, API-049, API-050, API-051, API-052, API-053, API-054, API-055, API-056, API-057, API-058, API-059, API-060, API-061, API-062, API-063, API-064, API-065, API-066, API-067, API-068, API-069, API-070, API-071, API-072, API-073, API-074, API-075, API-076, API-077, API-078, API-079, API-080, API-081, API-082, API-083, API-084, API-085, API-086, API-087, API-088, API-089, API-090, API-091, API-092, API-093, API-094, API-095, API-096, API-097, ACC-ROUTE-001, ACC-ROUTE-002, ACC-ROUTE-007, ACC-ROUTE-006, ACC-ROUTE-003, ACC-ROUTE-004, ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`insurance.insurers`](Tables/insurance/insurers.md) | Verified insurer parties | Future insurance / Insurance integration owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`insurance.tpas`](Tables/insurance/tpas.md) | Third-party administrator parties | Future insurance / Insurance integration owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`logistics.carriers`](Tables/logistics/carriers.md) | Delivery operator and integration capability identities | Delivery_Operations / Delivery configuration administrator | Open — owner dataset required | API-014, API-020, API-031, API-032, API-041, API-042, API-064, API-065, API-066, API-067, API-070, API-071, API-073, API-074, API-085 |
| [`logistics.delivery_failure_reasons`](Tables/logistics/delivery_failure_reasons.md) | Controlled unsuccessful delivery reason vocabulary | Delivery_Operations / Delivery Operations steward | Confirmed/Proposed list (2 rows) | API-066, API-073, API-074 |
| [`marketplace.sellers`](Tables/marketplace/sellers.md) | Verified seller parties | Future marketplace / Marketplace onboarding owner | Open — owner dataset required | API-012, API-018, API-019, API-020, API-021, API-024, API-026, API-027, API-028, API-029, API-039, API-040, API-041, API-042, API-043, API-044, API-045, API-046, API-047, API-052, API-059, API-062, API-063, API-071, API-081, API-082, API-083, API-085 |
| [`membership.plans`](Tables/membership/plans.md) | Versioned membership commercial offerings | Future membership / Membership product owner | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`organization.departments`](Tables/organization/departments.md) | Organization-scoped department hierarchy | Admin_CMS / Organization administrator | Open — owner dataset required | API-033, API-034, API-039, API-044, API-060, API-064, API-065, API-067, API-068, API-086 |
| [`organization.locations`](Tables/organization/locations.md) | Operating store/warehouse physical location identities | Admin_CMS / Organization administrator | Open — owner dataset required | API-014, API-033, API-034, API-038, API-039, API-040, API-041, API-042, API-044, API-045, API-046, API-047, API-048, API-050, API-051, API-052, API-056, API-057, API-058, API-059, API-060, API-064, API-065, API-067, API-068, API-071, API-084, API-086 |
| [`organization.organizations`](Tables/organization/organizations.md) | Verified operating legal organizations | Admin_CMS / Organization administrator | Open — owner dataset required | API-011, API-012, API-013, API-014, API-016, API-017, API-033, API-034, API-038, API-039, API-040, API-041, API-042, API-044, API-045, API-046, API-047, API-048, API-050, API-051, API-052, API-056, API-057, API-058, API-059, API-060, API-064, API-065, API-067, API-068, API-071, API-084, API-086 |
| [`payment.refund_reason_codes`](Tables/payment/refund_reason_codes.md) | Controlled refund instruction reasons | Finance_Payments / Finance policy owner | Confirmed/Proposed list (2 rows) | API-030, API-078 |
| [`procurement.suppliers`](Tables/procurement/suppliers.md) | Verified procurement supplier parties | Warehouse / Procurement steward | Open — owner dataset required | API-014, API-041, API-042, API-046, API-048, API-049, API-050, API-051, API-052, API-054, API-055, API-056, API-058, API-084 |
| [`support.ticket_tags`](Tables/support/ticket_tags.md) | Reusable support categorization vocabulary | Future support / Support lead | Confirmed/Proposed list (3 rows) | No current operation; future/operational maintenance scope |
| [`warehouse.aisles`](Tables/warehouse/aisles.md) | Persistent aisles within warehouse zones | Warehouse / Warehouse supervisor | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`warehouse.bins`](Tables/warehouse/bins.md) | Persistent bin locations for exact stock/picking | Warehouse / Warehouse supervisor | Open — owner dataset required | API-014, API-032, API-041, API-042, API-045, API-046, API-047, API-050, API-051, API-052, API-053, API-054, API-055, API-058, API-071, API-075, API-084 |
| [`warehouse.racks`](Tables/warehouse/racks.md) | Persistent racks within aisles | Warehouse / Warehouse supervisor | Open — owner dataset required | No current operation; future/operational maintenance scope |
| [`warehouse.stock_movement_reason_codes`](Tables/warehouse/stock_movement_reason_codes.md) | Controlled stock movement and discrepancy reasons | Inventory / Inventory controller | Confirmed/Proposed list (4 rows) | API-052, API-053, API-054 |
| [`warehouse.warehouses`](Tables/warehouse/warehouses.md) | Stock-holding site identities linked to organization locations | Warehouse / Organization / Warehouse administrator | Open — owner dataset required | API-012, API-014, API-020, API-027, API-032, API-039, API-040, API-041, API-042, API-044, API-045, API-046, API-047, API-048, API-049, API-050, API-051, API-052, API-053, API-054, API-055, API-056, API-057, API-058, API-059, API-071, API-075, API-084, API-085 |
| [`warehouse.zones`](Tables/warehouse/zones.md) | Persistent warehouse storage areas | Warehouse / Warehouse supervisor | Open — owner dataset required | No current operation; future/operational maintenance scope |

Each master table page contains its explicit records, exact attributes, inbound FK list, scope, lifecycle, uniqueness, creation/update authority, consuming APIs and pending decisions. Initial role codes are proposals from documented actors, not an existing seed/grant matrix. Subroles such as picker/packer/dispatcher are constrained permissions within Store Staff/Ops Manager unless Security approves separate roles. Clinical qualifications are an additional check, never just a role name.

## Controlled values that are not separate master tables

| Concept | Existing storage | Supported/proposed records | Source/status |
| --- | --- | --- | --- |
| P/M/O | catalog.commerce_classes.code | P prescription+review; M medicine without mandatory review; O other without mandatory review | Confirmed requirements and CHECK semantics; row existence unverified. |
| Descriptive product types | catalog.products.product_type | medicine, otc, device, wellness, lab_test, service | Confirmed table CHECK; distinct from commerce class, never a clinical gate. |
| Location types | organization.locations.location_type | store, warehouse | Proposed application allowlist from launch operating model; no type-master table exists. |
| Organization types | organization.organizations.organization_type | Open — real legal organization type vocabulary required | D-001/D-019; no invented company types or legal records. |
| Classification change reason | catalog.product_classification_history.reason_code | SOURCE_CORRECTION | Proposed technical source-correction reason; no dedicated reason master FK exists. |
| Settings | platform.application_settings(namespace,key,value) | checkout / codEnabled / boolean | Proposed configuration; default must not enable COD without D-007. Not a general unrestricted JSON settings API. |
| Reports | platform.report_definitions.code | sales, tax, stock, deliveries, audit | Proposed definition codes; name, owner_role, parameters_schema and export_ttl/data_classification require report owner approval; no source SQL or filing semantics fabricated. |
| Notification template | notification.templates(code,channel,locale,version) | ORDER_STATUS; sms/email/push; en-IN; version 1 | Proposed code/localization only; exact body/variables and provider registration require D-014/D-016. OTP primary WhatsApp/SMS fallback remains the inherited independent auth requirement. |
| Tax / HSN / rates | pricing.tax_rules; catalog.products.hsn_code/tax_code; invoice fields | Open — Finance/CA authoritative dated dataset required | Never infer a legal rate from synthetic invoice examples. D-012. |
| Payment methods/provider accounts | payment.payment_intents.method/provider and payment.provider_accounts | online intent is API selection; exact persisted provider/method vocabulary and account records Open | Provider credentials/contract and Financial meaning D-004/D-016; no master table invented. |
| Delivery/freshness/expiry/refund/retention limits | Existing configuration and owner policy, not invented master tables | Open — no legal/clinical durations, COD caps or freshness limits fabricated | D-005 through D-013. Sample technical rate/deadline proposals are not approved policy. |
| All status enums | CHECK constraints in linked table pages | Use each exact table CHECK list; a valid value does not authorize every pairwise transition | Confirmed schema vocabulary; proposed transitions specified per API and existing guards. |

## Full 266-table classification

| Schema/table | Classification | Classification basis |
| --- | --- | --- |
| [`appointment.appointment_slots`](Tables/appointment/appointment_slots.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`appointment.appointment_status_history`](Tables/appointment/appointment_status_history.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`appointment.appointments`](Tables/appointment/appointments.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`appointment.availability_exceptions`](Tables/appointment/availability_exceptions.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`appointment.availability_rules`](Tables/appointment/availability_rules.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`appointment.practitioner_services`](Tables/appointment/practitioner_services.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`appointment.service_types`](Tables/appointment/service_types.md) | Master / Reference | Service offerings and duration/payment/prescription configuration |
| [`appointment.teleconsultation_sessions`](Tables/appointment/teleconsultation_sessions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`appointment.waiting_room_events`](Tables/appointment/waiting_room_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`catalog.brands`](Tables/catalog/brands.md) | Master / Reference | Reusable brand identity |
| [`catalog.categories`](Tables/catalog/categories.md) | Master / Reference | Customer browse taxonomy and hierarchy |
| [`catalog.commerce_classes`](Tables/catalog/commerce_classes.md) | Master / Reference | Controlled P/M/O commerce eligibility |
| [`catalog.dosage_forms`](Tables/catalog/dosage_forms.md) | Master / Reference | Approved medicine dosage-form reference |
| [`catalog.manufacturers`](Tables/catalog/manufacturers.md) | Master / Reference | Verified manufacturing legal parties |
| [`catalog.product_attributes`](Tables/catalog/product_attributes.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`catalog.product_classification_history`](Tables/catalog/product_classification_history.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`catalog.product_content`](Tables/catalog/product_content.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`catalog.product_identifiers`](Tables/catalog/product_identifiers.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`catalog.product_media`](Tables/catalog/product_media.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`catalog.product_regulatory`](Tables/catalog/product_regulatory.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`catalog.product_relationships`](Tables/catalog/product_relationships.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`catalog.product_salts`](Tables/catalog/product_salts.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`catalog.product_variants`](Tables/catalog/product_variants.md) | Master / Reference | Distinct sellable pack/variant identities |
| [`catalog.products`](Tables/catalog/products.md) | Master / Reference | Stable sellable product identities and approved classifications |
| [`catalog.salts`](Tables/catalog/salts.md) | Master / Reference | Approved medicine composition reference |
| [`catalog.substitution_group_products`](Tables/catalog/substitution_group_products.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`catalog.substitution_groups`](Tables/catalog/substitution_groups.md) | Master / Reference | Approved equivalence group reference; no automatic substitution permission |
| [`catalog.units_of_measure`](Tables/catalog/units_of_measure.md) | Master / Reference | Reusable measurement dimensions and base conversion |
| [`clinical.care_episodes`](Tables/clinical/care_episodes.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.consultations`](Tables/clinical/consultations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.diagnoses`](Tables/clinical/diagnoses.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.observations`](Tables/clinical/observations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.order_review_items`](Tables/clinical/order_review_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.order_reviews`](Tables/clinical/order_reviews.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.patient_allergies`](Tables/clinical/patient_allergies.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.patient_conditions`](Tables/clinical/patient_conditions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.patient_medications`](Tables/clinical/patient_medications.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.patient_profiles`](Tables/clinical/patient_profiles.md) | Master / Reference | Stable protected patient identity, not clinical event history |
| [`clinical.practitioner_organizations`](Tables/clinical/practitioner_organizations.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`clinical.practitioner_profiles`](Tables/clinical/practitioner_profiles.md) | Master / Reference | Verified practitioner identity and qualifications |
| [`clinical.prescription_access_logs`](Tables/clinical/prescription_access_logs.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`clinical.prescription_documents`](Tables/clinical/prescription_documents.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`clinical.prescription_items`](Tables/clinical/prescription_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.prescriptions`](Tables/clinical/prescriptions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`clinical.review_reason_codes`](Tables/clinical/review_reason_codes.md) | Master / Reference | Controlled clinical review outcome reasons |
| [`commerce.cancellation_items`](Tables/commerce/cancellation_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.cancellation_reason_codes`](Tables/commerce/cancellation_reason_codes.md) | Master / Reference | Controlled customer/operations cancellation reasons |
| [`commerce.cancellations`](Tables/commerce/cancellations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.cart_items`](Tables/commerce/cart_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.carts`](Tables/commerce/carts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.checkouts`](Tables/commerce/checkouts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_allocations`](Tables/commerce/order_allocations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_charges`](Tables/commerce/order_charges.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_discounts`](Tables/commerce/order_discounts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_groups`](Tables/commerce/order_groups.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_items`](Tables/commerce/order_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_revisions`](Tables/commerce/order_revisions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.order_status_history`](Tables/commerce/order_status_history.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`commerce.orders`](Tables/commerce/orders.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.return_items`](Tables/commerce/return_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`commerce.return_reason_codes`](Tables/commerce/return_reason_codes.md) | Master / Reference | Controlled return request reasons |
| [`commerce.returns`](Tables/commerce/returns.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`compliance.adverse_event_reports`](Tables/compliance/adverse_event_reports.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`compliance.evidence`](Tables/compliance/evidence.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`compliance.legal_holds`](Tables/compliance/legal_holds.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`compliance.privacy_requests`](Tables/compliance/privacy_requests.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`compliance.product_recalls`](Tables/compliance/product_recalls.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`compliance.recall_lots`](Tables/compliance/recall_lots.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`compliance.regulatory_authorities`](Tables/compliance/regulatory_authorities.md) | Master / Reference | Authoritative regulatory-body identities referenced by verification records |
| [`compliance.regulatory_registrations`](Tables/compliance/regulatory_registrations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`customer.addresses`](Tables/customer/addresses.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`customer.consent_events`](Tables/customer/consent_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`customer.consents`](Tables/customer/consents.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`customer.family_members`](Tables/customer/family_members.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`customer.preferences`](Tables/customer/preferences.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`customer.profiles`](Tables/customer/profiles.md) | Master / Reference | Customer demographic master separated from identity credentials |
| [`customer.wishlist_items`](Tables/customer/wishlist_items.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`customer.wishlists`](Tables/customer/wishlists.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.diagnostic_order_items`](Tables/diagnostics/diagnostic_order_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.diagnostic_orders`](Tables/diagnostics/diagnostic_orders.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.diagnostic_reports`](Tables/diagnostics/diagnostic_reports.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.diagnostic_result_values`](Tables/diagnostics/diagnostic_result_values.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.lab_locations`](Tables/diagnostics/lab_locations.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`diagnostics.lab_offerings`](Tables/diagnostics/lab_offerings.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`diagnostics.lab_providers`](Tables/diagnostics/lab_providers.md) | Master / Reference | Verified diagnostic lab provider parties |
| [`diagnostics.sample_collections`](Tables/diagnostics/sample_collections.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.sample_events`](Tables/diagnostics/sample_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`diagnostics.samples`](Tables/diagnostics/samples.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`diagnostics.test_definitions`](Tables/diagnostics/test_definitions.md) | Master / Reference | Approved diagnostic service definitions |
| [`diagnostics.test_package_items`](Tables/diagnostics/test_package_items.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`diagnostics.test_packages`](Tables/diagnostics/test_packages.md) | Master / Reference | Approved diagnostic service bundles |
| [`finance.accounts`](Tables/finance/accounts.md) | Master / Reference | Chart-of-accounts identities used by journal lines |
| [`finance.credit_notes`](Tables/finance/credit_notes.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`finance.invoice_items`](Tables/finance/invoice_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`finance.invoices`](Tables/finance/invoices.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`finance.journal_entries`](Tables/finance/journal_entries.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`finance.journal_lines`](Tables/finance/journal_lines.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`finance.settlement_items`](Tables/finance/settlement_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`finance.settlement_runs`](Tables/finance/settlement_runs.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.fulfillment_events`](Tables/fulfillment/fulfillment_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`fulfillment.fulfillment_order_items`](Tables/fulfillment/fulfillment_order_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.fulfillment_orders`](Tables/fulfillment/fulfillment_orders.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.pack_tasks`](Tables/fulfillment/pack_tasks.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.package_items`](Tables/fulfillment/package_items.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`fulfillment.packages`](Tables/fulfillment/packages.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.pick_task_items`](Tables/fulfillment/pick_task_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.pick_tasks`](Tables/fulfillment/pick_tasks.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`fulfillment.picking_wave_orders`](Tables/fulfillment/picking_wave_orders.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`fulfillment.picking_waves`](Tables/fulfillment/picking_waves.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`identity.api_client_secrets`](Tables/identity/api_client_secrets.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`identity.api_clients`](Tables/identity/api_clients.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`identity.login_attempts`](Tables/identity/login_attempts.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`identity.mfa_factors`](Tables/identity/mfa_factors.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`identity.otp_challenges`](Tables/identity/otp_challenges.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`identity.password_history`](Tables/identity/password_history.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`identity.permissions`](Tables/identity/permissions.md) | Master / Reference | Action/resource grant vocabulary |
| [`identity.role_permissions`](Tables/identity/role_permissions.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`identity.roles`](Tables/identity/roles.md) | Master / Reference | Business role identities, separate from PostgreSQL runtime roles |
| [`identity.sessions`](Tables/identity/sessions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`identity.trusted_devices`](Tables/identity/trusted_devices.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`identity.user_profiles`](Tables/identity/user_profiles.md) | Master / Reference | Staff/general identity display-profile companion |
| [`identity.user_roles`](Tables/identity/user_roles.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`identity.users`](Tables/identity/users.md) | Master / Reference | Stable identity account master; credentials are protected attributes |
| [`insurance.claim_documents`](Tables/insurance/claim_documents.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`insurance.claim_status_history`](Tables/insurance/claim_status_history.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`insurance.claims`](Tables/insurance/claims.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`insurance.eligibility_checks`](Tables/insurance/eligibility_checks.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`insurance.insurers`](Tables/insurance/insurers.md) | Master / Reference | Verified insurer parties |
| [`insurance.policies`](Tables/insurance/policies.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`insurance.policy_members`](Tables/insurance/policy_members.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`insurance.tpas`](Tables/insurance/tpas.md) | Master / Reference | Third-party administrator parties |
| [`logistics.carrier_accounts`](Tables/logistics/carrier_accounts.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`logistics.carriers`](Tables/logistics/carriers.md) | Master / Reference | Delivery operator and integration capability identities |
| [`logistics.delivery_assignments`](Tables/logistics/delivery_assignments.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`logistics.delivery_attempts`](Tables/logistics/delivery_attempts.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`logistics.delivery_failure_reasons`](Tables/logistics/delivery_failure_reasons.md) | Master / Reference | Controlled unsuccessful delivery reason vocabulary |
| [`logistics.delivery_location_updates`](Tables/logistics/delivery_location_updates.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`logistics.delivery_otp_challenges`](Tables/logistics/delivery_otp_challenges.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`logistics.delivery_routes`](Tables/logistics/delivery_routes.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`logistics.delivery_slots`](Tables/logistics/delivery_slots.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`logistics.ndr_cases`](Tables/logistics/ndr_cases.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`logistics.reverse_shipments`](Tables/logistics/reverse_shipments.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`logistics.rider_shifts`](Tables/logistics/rider_shifts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`logistics.serviceability_rules`](Tables/logistics/serviceability_rules.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`logistics.shipment_events`](Tables/logistics/shipment_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`logistics.shipments`](Tables/logistics/shipments.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`marketplace.commission_plans`](Tables/marketplace/commission_plans.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`marketplace.seller_commission_assignments`](Tables/marketplace/seller_commission_assignments.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`marketplace.seller_locations`](Tables/marketplace/seller_locations.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`marketplace.seller_product_listings`](Tables/marketplace/seller_product_listings.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`marketplace.seller_ratings`](Tables/marketplace/seller_ratings.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`marketplace.seller_service_levels`](Tables/marketplace/seller_service_levels.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`marketplace.sellers`](Tables/marketplace/sellers.md) | Master / Reference | Verified seller parties |
| [`membership.benefit_usage`](Tables/membership/benefit_usage.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`membership.loyalty_accounts`](Tables/membership/loyalty_accounts.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`membership.loyalty_ledger`](Tables/membership/loyalty_ledger.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`membership.plan_benefits`](Tables/membership/plan_benefits.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`membership.plans`](Tables/membership/plans.md) | Master / Reference | Versioned membership commercial offerings |
| [`membership.subscriptions`](Tables/membership/subscriptions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`notification.device_endpoints`](Tables/notification/device_endpoints.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`notification.in_app_notifications`](Tables/notification/in_app_notifications.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`notification.message_attachments`](Tables/notification/message_attachments.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`notification.message_attempts`](Tables/notification/message_attempts.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`notification.messages`](Tables/notification/messages.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`notification.provider_configurations`](Tables/notification/provider_configurations.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`notification.provider_webhooks`](Tables/notification/provider_webhooks.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`notification.suppressions`](Tables/notification/suppressions.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`notification.templates`](Tables/notification/templates.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`notification.user_channel_preferences`](Tables/notification/user_channel_preferences.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`organization.bank_accounts`](Tables/organization/bank_accounts.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`organization.departments`](Tables/organization/departments.md) | Master / Reference | Organization-scoped department hierarchy |
| [`organization.licenses`](Tables/organization/licenses.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`organization.locations`](Tables/organization/locations.md) | Master / Reference | Operating store/warehouse physical location identities |
| [`organization.memberships`](Tables/organization/memberships.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`organization.organizations`](Tables/organization/organizations.md) | Master / Reference | Verified operating legal organizations |
| [`payment.chargebacks`](Tables/payment/chargebacks.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.cod_collections`](Tables/payment/cod_collections.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.customer_payment_methods`](Tables/payment/customer_payment_methods.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`payment.payment_attempts`](Tables/payment/payment_attempts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.payment_intents`](Tables/payment/payment_intents.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.payment_transactions`](Tables/payment/payment_transactions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.payment_webhooks`](Tables/payment/payment_webhooks.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`payment.provider_accounts`](Tables/payment/provider_accounts.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`payment.reconciliation_items`](Tables/payment/reconciliation_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.reconciliation_runs`](Tables/payment/reconciliation_runs.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.refund_allocations`](Tables/payment/refund_allocations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`payment.refund_reason_codes`](Tables/payment/refund_reason_codes.md) | Master / Reference | Controlled refund instruction reasons |
| [`payment.refunds`](Tables/payment/refunds.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`platform.application_settings`](Tables/platform/application_settings.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`platform.audit_logs`](Tables/platform/audit_logs.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`platform.cms_banners`](Tables/platform/cms_banners.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`platform.cms_page_versions`](Tables/platform/cms_page_versions.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`platform.cms_pages`](Tables/platform/cms_pages.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`platform.data_retention_policies`](Tables/platform/data_retention_policies.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`platform.feature_flags`](Tables/platform/feature_flags.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`platform.file_access_events`](Tables/platform/file_access_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`platform.file_access_grants`](Tables/platform/file_access_grants.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`platform.file_objects`](Tables/platform/file_objects.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.file_scan_events`](Tables/platform/file_scan_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`platform.file_upload_sessions`](Tables/platform/file_upload_sessions.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.file_variants`](Tables/platform/file_variants.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`platform.idempotency_keys`](Tables/platform/idempotency_keys.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.inbox_messages`](Tables/platform/inbox_messages.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.outbox_events`](Tables/platform/outbox_events.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.report_definitions`](Tables/platform/report_definitions.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`platform.report_runs`](Tables/platform/report_runs.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.scheduled_jobs`](Tables/platform/scheduled_jobs.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`platform.webhook_deliveries`](Tables/platform/webhook_deliveries.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`platform.webhook_endpoints`](Tables/platform/webhook_endpoints.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`pricing.coupon_codes`](Tables/pricing/coupon_codes.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`pricing.price_books`](Tables/pricing/price_books.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`pricing.pricing_evaluations`](Tables/pricing/pricing_evaluations.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`pricing.product_prices`](Tables/pricing/product_prices.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`pricing.promotion_redemptions`](Tables/pricing/promotion_redemptions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`pricing.promotion_versions`](Tables/pricing/promotion_versions.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`pricing.promotions`](Tables/pricing/promotions.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`pricing.tax_rules`](Tables/pricing/tax_rules.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`procurement.goods_receipt_items`](Tables/procurement/goods_receipt_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.goods_receipt_quality_checks`](Tables/procurement/goods_receipt_quality_checks.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.goods_receipts`](Tables/procurement/goods_receipts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.purchase_order_items`](Tables/procurement/purchase_order_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.purchase_orders`](Tables/procurement/purchase_orders.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.purchase_requisition_items`](Tables/procurement/purchase_requisition_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.purchase_requisitions`](Tables/procurement/purchase_requisitions.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.purchase_return_items`](Tables/procurement/purchase_return_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.purchase_returns`](Tables/procurement/purchase_returns.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.supplier_invoices`](Tables/procurement/supplier_invoices.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.supplier_licenses`](Tables/procurement/supplier_licenses.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`procurement.supplier_products`](Tables/procurement/supplier_products.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`procurement.suppliers`](Tables/procurement/suppliers.md) | Master / Reference | Verified procurement supplier parties |
| [`risk.assessments`](Tables/risk/assessments.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`risk.blocklists`](Tables/risk/blocklists.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`risk.cases`](Tables/risk/cases.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`risk.rules`](Tables/risk/rules.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`risk.signals`](Tables/risk/signals.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`search.documents`](Tables/search/documents.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`search.indexing_jobs`](Tables/search/indexing_jobs.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`search.query_events`](Tables/search/query_events.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`search.redirects`](Tables/search/redirects.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`search.synonyms`](Tables/search/synonyms.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`support.sla_policies`](Tables/support/sla_policies.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`support.ticket_actions`](Tables/support/ticket_actions.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`support.ticket_attachments`](Tables/support/ticket_attachments.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`support.ticket_messages`](Tables/support/ticket_messages.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`support.ticket_status_history`](Tables/support/ticket_status_history.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`support.ticket_tag_assignments`](Tables/support/ticket_tag_assignments.md) | Mapping / Junction | Associates existing identities; reference fields do not confer write ownership. |
| [`support.ticket_tags`](Tables/support/ticket_tags.md) | Master / Reference | Reusable support categorization vocabulary |
| [`support.tickets`](Tables/support/tickets.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.aisles`](Tables/warehouse/aisles.md) | Master / Reference | Persistent aisles within warehouse zones |
| [`warehouse.bins`](Tables/warehouse/bins.md) | Master / Reference | Persistent bin locations for exact stock/picking |
| [`warehouse.cycle_count_items`](Tables/warehouse/cycle_count_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.cycle_counts`](Tables/warehouse/cycle_counts.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.inventory_adjustment_items`](Tables/warehouse/inventory_adjustment_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.inventory_adjustments`](Tables/warehouse/inventory_adjustments.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.inventory_lots`](Tables/warehouse/inventory_lots.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.racks`](Tables/warehouse/racks.md) | Master / Reference | Persistent racks within aisles |
| [`warehouse.replenishment_rules`](Tables/warehouse/replenishment_rules.md) | Configuration | Changes behavior/policy or stores scoped integration setup. |
| [`warehouse.stock_balances`](Tables/warehouse/stock_balances.md) | Derived / Operational | Operational coordination, derived state or generated artifact; not a reusable vocabulary. |
| [`warehouse.stock_holds`](Tables/warehouse/stock_holds.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.stock_ledger`](Tables/warehouse/stock_ledger.md) | Audit / History | Retains immutable/versioned event or access evidence. |
| [`warehouse.stock_movement_reason_codes`](Tables/warehouse/stock_movement_reason_codes.md) | Master / Reference | Controlled stock movement and discrepancy reasons |
| [`warehouse.stock_reservations`](Tables/warehouse/stock_reservations.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.stock_transfer_items`](Tables/warehouse/stock_transfer_items.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.stock_transfers`](Tables/warehouse/stock_transfers.md) | Transactional | Business aggregate/occurrence with stateful evidence and dependent records. |
| [`warehouse.warehouses`](Tables/warehouse/warehouses.md) | Master / Reference | Stock-holding site identities linked to organization locations |
| [`warehouse.zones`](Tables/warehouse/zones.md) | Master / Reference | Persistent warehouse storage areas |

## Bootstrap and lifecycle review

Load approved organization/identity bootstrap actors using a restricted deployment process; system actors and optional created_by fields must follow actual FK/nullability. Load reference values and verified parties before products/warehouse structure, then mappings/configuration and operational transactions. Cycles (user/profile defaults, order/current revision and child order_id) must use existing nullable stages/deferred constraints exactly as documented, never disabled FK checks.

Retire masters for new use while retaining historical references. Recheck clinical/financial dependencies before changes; stable codes stay stable. There is no blanket master CRUD API. Missing management commands are listed in [journey/API gaps](../05-APIs/Journey-API-Gaps.md). Future schemas (appointments, diagnostics, insurance, marketplace, membership, advanced support) remain outside approved launch scope.
