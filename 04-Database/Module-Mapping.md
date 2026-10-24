# Module to database mapping

<!-- ERD-MODULE-MAP-START -->

## ER diagram navigation

This table links a feature module to the actual database schemas it may read or write; it does not assign exclusive ownership. The candidate modules are inherited from the existing module-to-database map.

| Module | Database ER diagrams |
|---|---|
| [Admin_CMS](../03-Modules/Admin/README.md) | [`organization`](ER-Diagrams/16-organization.md), [`platform`](ER-Diagrams/18-platform.md) |
| [Audit](../03-Modules/Audit/README.md) | [`compliance`](ER-Diagrams/05-compliance.md), [`platform`](ER-Diagrams/18-platform.md), [`risk`](ER-Diagrams/21-risk.md) |
| [Authentication_Access](../03-Modules/Authentication/README.md) | [`identity`](ER-Diagrams/10-identity.md), [`organization`](ER-Diagrams/16-organization.md) |
| [Cart_Checkout](../03-Modules/Cart-Checkout/README.md) | [`commerce`](ER-Diagrams/04-commerce.md), [`pricing`](ER-Diagrams/19-pricing.md), [`warehouse`](ER-Diagrams/24-warehouse.md) |
| [Customer_Accounts](../03-Modules/Customer-Accounts/README.md) | [`customer`](ER-Diagrams/06-customer.md), [`identity`](ER-Diagrams/10-identity.md), [`clinical`](ER-Diagrams/03-clinical.md) |
| [Customer_Orders](../03-Modules/Customer-Orders/README.md) | [`commerce`](ER-Diagrams/04-commerce.md), [`logistics`](ER-Diagrams/12-logistics.md) |
| [Delivery_Operations](../03-Modules/Delivery/README.md) | [`logistics`](ER-Diagrams/12-logistics.md), [`organization`](ER-Diagrams/16-organization.md) |
| [Finance_Payments](../03-Modules/Payments/README.md) | [`payment`](ER-Diagrams/17-payment.md), [`finance`](ER-Diagrams/08-finance.md), [`commerce`](ER-Diagrams/04-commerce.md) |
| [Inventory](../03-Modules/Inventory/README.md) | [`warehouse`](ER-Diagrams/24-warehouse.md), [`catalog`](ER-Diagrams/02-catalog.md), [`procurement`](ER-Diagrams/20-procurement.md) |
| [Notifications](../03-Modules/Notifications/README.md) | [`notification`](ER-Diagrams/15-notification.md), [`platform`](ER-Diagrams/18-platform.md) |
| [Order_Operations](../03-Modules/Order-Management/README.md) | [`commerce`](ER-Diagrams/04-commerce.md), [`fulfillment`](ER-Diagrams/09-fulfillment.md), [`organization`](ER-Diagrams/16-organization.md) |
| [Pharmacist_Review](../03-Modules/Pharmacist-Review/README.md) | [`clinical`](ER-Diagrams/03-clinical.md), [`commerce`](ER-Diagrams/04-commerce.md) |
| [Prescription_Upload](../03-Modules/Prescription-Management/README.md) | [`clinical`](ER-Diagrams/03-clinical.md), [`platform`](ER-Diagrams/18-platform.md) |
| [Product_Catalog](../03-Modules/Product-Catalog/README.md) | [`catalog`](ER-Diagrams/02-catalog.md), [`marketplace`](ER-Diagrams/13-marketplace.md), [`pricing`](ER-Diagrams/19-pricing.md), [`search`](ER-Diagrams/22-search.md) |
| [Reporting](../03-Modules/Reporting/README.md) | [`platform`](ER-Diagrams/18-platform.md), [`finance`](ER-Diagrams/08-finance.md) |
| [Rider_App](../03-Modules/Rider-Operations/README.md) | [`identity`](ER-Diagrams/10-identity.md), [`logistics`](ER-Diagrams/12-logistics.md), [`notification`](ER-Diagrams/15-notification.md) |
| [Store_Operations](../03-Modules/Store-Operations/README.md) | [`fulfillment`](ER-Diagrams/09-fulfillment.md), [`warehouse`](ER-Diagrams/24-warehouse.md), [`procurement`](ER-Diagrams/20-procurement.md) |
| [Warehouse](../03-Modules/Warehouse/README.md) | [`warehouse`](ER-Diagrams/24-warehouse.md), [`procurement`](ER-Diagrams/20-procurement.md) |

<!-- ERD-MODULE-MAP-END -->

[Command/data ownership and transaction boundaries](../07-Engineering/State-and-Recovery-Contracts.md#command-ownership-and-transaction-boundary) define the proposed writers. The lists below discover tables; they do not grant write access.

## Admin CMS

### Admin masters and editorial pages — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `platform.cms_pages` | Candidate read/write aggregate | all fields |
| `platform.cms_page_versions` | Candidate read/integrate with domain owner | all fields |
| `platform.cms_banners` | Candidate read/integrate with domain owner | all fields |
| `platform.application_settings` | Candidate read/integrate with domain owner | all fields |
| `organization.locations` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Master data publication is an approved versioned action; staff scope is checked server-side. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Audit

### Immutable change evidence — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `platform.audit_logs` | Candidate read/write aggregate | all fields |
| `platform.file_access_events` | Candidate read/integrate with domain owner | all fields |
| `compliance.evidence` | Candidate read/integrate with domain owner | all fields |
| `platform.report_runs` | Candidate read/integrate with domain owner | all fields |
| `identity.login_attempts` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: All privileged and denied actions generate minimum necessary audit evidence without raw secrets. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Authentication Access

### Login, sessions, roles and access control — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `identity.users` | Candidate read/write aggregate | all fields |
| `identity.sessions` | Candidate read/integrate with domain owner | all fields |
| `identity.roles` | Candidate read/integrate with domain owner | all fields |
| `identity.user_roles` | Candidate read/integrate with domain owner | all fields |
| `identity.permissions` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Client-supplied actor, role and location are never trusted as authorisation context. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Cart Checkout

### Cart, quote and placement intent — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `commerce.carts` | Candidate read/write aggregate | all fields |
| `commerce.cart_items` | Candidate read/integrate with domain owner | all fields |
| `commerce.checkouts` | Candidate read/integrate with domain owner | all fields |
| `commerce.orders` | Candidate read/integrate with domain owner | all fields |
| `platform.idempotency_keys` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: A changed fee, classification or inventory observation invalidates a quote until reaccepted; replay cannot create two orders. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Customer Accounts

### Customer profiles and family access — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `identity.users` | Candidate read/write aggregate | all fields |
| `customer.profiles` | Candidate read/integrate with domain owner | all fields |
| `customer.family_members` | Candidate read/integrate with domain owner | all fields |
| `customer.addresses` | Candidate read/integrate with domain owner | all fields |
| `clinical.patient_profiles` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Customer submits OTP, selects patient/address; sensitive information is never returned to other accounts. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Customer Orders

### Order tracking and aftercare — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `commerce.orders` | Candidate read/write aggregate | all fields |
| `commerce.order_items` | Candidate read/integrate with domain owner | all fields |
| `commerce.cancellations` | Candidate read/integrate with domain owner | all fields |
| `commerce.returns` | Candidate read/integrate with domain owner | all fields |
| `commerce.order_status_history` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Customer cancellation or return requests must respect current order/fulfillment/payment states. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Delivery Operations

### Delivery planning, route and proof — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `logistics.shipments` | Candidate read/write aggregate | all fields |
| `logistics.delivery_assignments` | Candidate read/integrate with domain owner | all fields |
| `logistics.delivery_attempts` | Candidate read/integrate with domain owner | all fields |
| `logistics.delivery_slots` | Candidate read/integrate with domain owner | all fields |
| `logistics.ndr_cases` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Order handoff to courier requires authorised assignment; failed attempts retain reason and evidence. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Finance Payments

### Payment truth, refunds and invoice evidence — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `payment.payment_intents` | Candidate read/write aggregate | all fields |
| `payment.payment_attempts` | Candidate read/integrate with domain owner | all fields |
| `payment.payment_webhooks` | Candidate read/integrate with domain owner | all fields |
| `payment.refunds` | Candidate read/integrate with domain owner | all fields |
| `finance.invoices` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Unknown provider outcomes stay pending; external callbacks cannot double-apply money. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Inventory

### Lot-aware inventory and reservation — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `warehouse.stock_balances` | Candidate read/write aggregate | all fields |
| `warehouse.stock_reservations` | Candidate read/integrate with domain owner | all fields |
| `warehouse.inventory_lots` | Candidate read/integrate with domain owner | all fields |
| `warehouse.stock_ledger` | Candidate read/integrate with domain owner | all fields |
| `warehouse.stock_holds` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: A reservation must not create negative eligible stock and must not use expired/blocked lots. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Notifications

### Transactional customer/staff messaging — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `notification.messages` | Candidate read/write aggregate | all fields |
| `notification.message_attempts` | Candidate read/integrate with domain owner | all fields |
| `notification.templates` | Candidate read/integrate with domain owner | all fields |
| `notification.user_channel_preferences` | Candidate read/integrate with domain owner | all fields |
| `platform.outbox_events` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Notification delivery is best effort after commit; it must never determine success of a stock or money action. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Order Operations

### Order orchestration and routing — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `commerce.orders` | Candidate read/write aggregate | all fields |
| `commerce.order_revisions` | Candidate read/integrate with domain owner | all fields |
| `commerce.order_allocations` | Candidate read/integrate with domain owner | all fields |
| `fulfillment.fulfillment_orders` | Candidate read/integrate with domain owner | all fields |
| `organization.licenses` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: One order must have one accepted revision and an auditable licensed location/fulfillment decision. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Pharmacist Review

### Clinical review for prescription items — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `clinical.order_reviews` | Candidate read/write aggregate | all fields |
| `clinical.order_review_items` | Candidate read/integrate with domain owner | all fields |
| `clinical.prescriptions` | Candidate read/integrate with domain owner | all fields |
| `clinical.review_reason_codes` | Candidate read/integrate with domain owner | all fields |
| `commerce.order_items` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Prescription Upload

### Private prescription intake — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `clinical.prescriptions` | Candidate read/write aggregate | all fields |
| `clinical.prescription_documents` | Candidate read/integrate with domain owner | all fields |
| `platform.file_objects` | Candidate read/integrate with domain owner | all fields |
| `platform.file_access_events` | Candidate read/integrate with domain owner | all fields |
| `platform.file_upload_sessions` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: An uploaded file is quarantined until inspected and can only be accessed by permitted patients and reviewers. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Product Catalog

### Product discovery and classification — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `catalog.products` | Candidate read/write aggregate | all fields |
| `catalog.product_variants` | Candidate read/integrate with domain owner | all fields |
| `catalog.product_classification_history` | Candidate read/integrate with domain owner | all fields |
| `catalog.categories` | Candidate read/integrate with domain owner | all fields |
| `search.documents` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Only approved and classified items can enter a legally permitted checkout path. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Reporting

### Scoped operations and financial reports — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `platform.report_definitions` | Candidate read/write aggregate | all fields |
| `platform.report_runs` | Candidate read/integrate with domain owner | all fields |
| `finance.settlement_runs` | Candidate read/integrate with domain owner | all fields |
| `commerce.orders` | Candidate read/integrate with domain owner | all fields |
| `platform.file_access_grants` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Reports must be authorised by entity scope and must not export unapproved patient data. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Rider App

### Rider shifts and delivery actions — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `logistics.rider_shifts` | Candidate read/write aggregate | all fields |
| `logistics.delivery_assignments` | Candidate read/integrate with domain owner | all fields |
| `logistics.delivery_otp_challenges` | Candidate read/integrate with domain owner | all fields |
| `logistics.delivery_location_updates` | Candidate read/integrate with domain owner | all fields |
| `payment.cod_collections` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Rider sees only assigned delivery and masked necessary information; OTP outcome stays server-validated. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Store Operations

### Picking, packing and store replenishment — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `fulfillment.pick_tasks` | Candidate read/write aggregate | all fields |
| `fulfillment.pack_tasks` | Candidate read/integrate with domain owner | all fields |
| `fulfillment.packages` | Candidate read/integrate with domain owner | all fields |
| `warehouse.stock_balances` | Candidate read/integrate with domain owner | all fields |
| `procurement.purchase_requisitions` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Store actors can mutate only scoped tasks and must report actual shortages, never silently substitute. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Warehouse

### Warehouse replenishment and transfers — existing database usage

**Status: Inferred application usage backed by confirmed table existence.** Do not confuse a physical schema with a write-access entitlement. Module table choices are implementation candidates until contract reviewed.

| Verified table | Intended use | Schema/field reference |
| --- | --- | --- |
| `warehouse.warehouses` | Candidate read/write aggregate | all fields |
| `warehouse.stock_transfers` | Candidate read/integrate with domain owner | all fields |
| `warehouse.stock_transfer_items` | Candidate read/integrate with domain owner | all fields |
| `procurement.goods_receipts` | Candidate read/integrate with domain owner | all fields |
| `warehouse.stock_ledger` | Candidate read/integrate with domain owner | all fields |

### Transaction boundary

Enforce: Receiving and transfers create a traceable stock ledger and require location/lot scope. Store durable business facts and outbox events atomically. Reconcile external side effects after commit. Verify appropriate database capability grants and RLS before enabling writes.

**Related:** LLD database operations · API index.

## Effective table ownership register

All 266 physical tables have a proposed accountable write owner below. Future ownership requires D-027; shared infrastructure is separately assigned. API column writes remain proposals until D-024/runtime privilege review. Read access does not imply write ownership. The per-module Database pages list exact consuming API columns, delegated writes and master dependencies.

| Table | Classification | Proposed writer / accountable decision | Contract-consuming modules |
| --- | --- | --- | --- |
| [`appointment.appointment_slots`](Tables/appointment/appointment_slots.md) | Derived / Operational | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.appointment_status_history`](Tables/appointment/appointment_status_history.md) | Audit / History | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.appointments`](Tables/appointment/appointments.md) | Transactional | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.availability_exceptions`](Tables/appointment/availability_exceptions.md) | Configuration | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.availability_rules`](Tables/appointment/availability_rules.md) | Configuration | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.practitioner_services`](Tables/appointment/practitioner_services.md) | Mapping / Junction | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.service_types`](Tables/appointment/service_types.md) | Master / Reference | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.teleconsultation_sessions`](Tables/appointment/teleconsultation_sessions.md) | Transactional | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`appointment.waiting_room_events`](Tables/appointment/waiting_room_events.md) | Audit / History | Future appointment owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`catalog.brands`](Tables/catalog/brands.md) | Master / Reference | Product_Catalog | Product_Catalog |
| [`catalog.categories`](Tables/catalog/categories.md) | Master / Reference | Product_Catalog | Product_Catalog |
| [`catalog.commerce_classes`](Tables/catalog/commerce_classes.md) | Master / Reference | Product_Catalog | Cart_Checkout, Product_Catalog |
| [`catalog.dosage_forms`](Tables/catalog/dosage_forms.md) | Master / Reference | Product_Catalog | Product_Catalog |
| [`catalog.manufacturers`](Tables/catalog/manufacturers.md) | Master / Reference | Product_Catalog | Product_Catalog |
| [`catalog.product_attributes`](Tables/catalog/product_attributes.md) | Configuration | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.product_classification_history`](Tables/catalog/product_classification_history.md) | Audit / History | Product_Catalog | Product_Catalog |
| [`catalog.product_content`](Tables/catalog/product_content.md) | Configuration | Product_Catalog | Product_Catalog |
| [`catalog.product_identifiers`](Tables/catalog/product_identifiers.md) | Mapping / Junction | Product_Catalog | Store_Operations |
| [`catalog.product_media`](Tables/catalog/product_media.md) | Mapping / Junction | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.product_regulatory`](Tables/catalog/product_regulatory.md) | Configuration | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.product_relationships`](Tables/catalog/product_relationships.md) | Mapping / Junction | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.product_salts`](Tables/catalog/product_salts.md) | Mapping / Junction | Product_Catalog | Product_Catalog |
| [`catalog.product_variants`](Tables/catalog/product_variants.md) | Master / Reference | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.products`](Tables/catalog/products.md) | Master / Reference | Product_Catalog | Cart_Checkout, Customer_Accounts, Inventory, Order_Operations, Product_Catalog, Store_Operations |
| [`catalog.salts`](Tables/catalog/salts.md) | Master / Reference | Product_Catalog | Product_Catalog |
| [`catalog.substitution_group_products`](Tables/catalog/substitution_group_products.md) | Mapping / Junction | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.substitution_groups`](Tables/catalog/substitution_groups.md) | Master / Reference | Product_Catalog | No current API; retain for future/operational scope |
| [`catalog.units_of_measure`](Tables/catalog/units_of_measure.md) | Master / Reference | Product_Catalog | No current API; retain for future/operational scope |
| [`clinical.care_episodes`](Tables/clinical/care_episodes.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.consultations`](Tables/clinical/consultations.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.diagnoses`](Tables/clinical/diagnoses.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.observations`](Tables/clinical/observations.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.order_review_items`](Tables/clinical/order_review_items.md) | Transactional | Pharmacist_Review | Finance_Payments, Inventory, Order_Operations, Pharmacist_Review, Prescription_Upload, Rider_App, Store_Operations |
| [`clinical.order_reviews`](Tables/clinical/order_reviews.md) | Transactional | Pharmacist_Review | Admin_CMS, Finance_Payments, Inventory, Order_Operations, Pharmacist_Review, Prescription_Upload, Rider_App, Store_Operations |
| [`clinical.patient_allergies`](Tables/clinical/patient_allergies.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.patient_conditions`](Tables/clinical/patient_conditions.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.patient_medications`](Tables/clinical/patient_medications.md) | Transactional | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.patient_profiles`](Tables/clinical/patient_profiles.md) | Master / Reference | Prescription_Upload | Cart_Checkout, Customer_Accounts, Prescription_Upload |
| [`clinical.practitioner_organizations`](Tables/clinical/practitioner_organizations.md) | Mapping / Junction | Future clinical-care owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`clinical.practitioner_profiles`](Tables/clinical/practitioner_profiles.md) | Master / Reference | Pharmacist_Review | Pharmacist_Review |
| [`clinical.prescription_access_logs`](Tables/clinical/prescription_access_logs.md) | Audit / History | Prescription_Upload | No current API; retain for future/operational scope |
| [`clinical.prescription_documents`](Tables/clinical/prescription_documents.md) | Mapping / Junction | Prescription_Upload | Pharmacist_Review, Prescription_Upload |
| [`clinical.prescription_items`](Tables/clinical/prescription_items.md) | Transactional | Prescription_Upload | Pharmacist_Review |
| [`clinical.prescriptions`](Tables/clinical/prescriptions.md) | Transactional | Prescription_Upload | Pharmacist_Review, Prescription_Upload |
| [`clinical.review_reason_codes`](Tables/clinical/review_reason_codes.md) | Master / Reference | Pharmacist_Review | Pharmacist_Review |
| [`commerce.cancellation_items`](Tables/commerce/cancellation_items.md) | Transactional | Order_Operations | Customer_Orders |
| [`commerce.cancellation_reason_codes`](Tables/commerce/cancellation_reason_codes.md) | Master / Reference | Order_Operations | Customer_Orders |
| [`commerce.cancellations`](Tables/commerce/cancellations.md) | Transactional | Order_Operations | Customer_Orders |
| [`commerce.cart_items`](Tables/commerce/cart_items.md) | Transactional | Cart_Checkout | Cart_Checkout |
| [`commerce.carts`](Tables/commerce/carts.md) | Transactional | Cart_Checkout | Cart_Checkout |
| [`commerce.checkouts`](Tables/commerce/checkouts.md) | Transactional | Cart_Checkout | Cart_Checkout, Customer_Accounts |
| [`commerce.order_allocations`](Tables/commerce/order_allocations.md) | Transactional | Order_Operations | Order_Operations, Warehouse |
| [`commerce.order_charges`](Tables/commerce/order_charges.md) | Transactional | Order_Operations | No current API; retain for future/operational scope |
| [`commerce.order_discounts`](Tables/commerce/order_discounts.md) | Transactional | Order_Operations | No current API; retain for future/operational scope |
| [`commerce.order_groups`](Tables/commerce/order_groups.md) | Transactional | Order_Operations | No current API; retain for future/operational scope |
| [`commerce.order_items`](Tables/commerce/order_items.md) | Transactional | Order_Operations | Cart_Checkout, Customer_Orders, Inventory, Order_Operations, Pharmacist_Review, Prescription_Upload, Store_Operations |
| [`commerce.order_revisions`](Tables/commerce/order_revisions.md) | Transactional | Order_Operations | Cart_Checkout, Customer_Orders, Finance_Payments, Inventory, Order_Operations, Pharmacist_Review, Rider_App, Store_Operations, Warehouse |
| [`commerce.order_status_history`](Tables/commerce/order_status_history.md) | Audit / History | Order_Operations | Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review |
| [`commerce.orders`](Tables/commerce/orders.md) | Transactional | Order_Operations | Admin_CMS, Cart_Checkout, Customer_Accounts, Customer_Orders, Finance_Payments, Inventory, Notifications, Order_Operations, Pharmacist_Review, Prescription_Upload, Reporting, Rider_App, Store_Operations, Warehouse |
| [`commerce.return_items`](Tables/commerce/return_items.md) | Transactional | Order_Operations | Customer_Orders |
| [`commerce.return_reason_codes`](Tables/commerce/return_reason_codes.md) | Master / Reference | Order_Operations | Customer_Orders |
| [`commerce.returns`](Tables/commerce/returns.md) | Transactional | Order_Operations | Customer_Orders |
| [`compliance.adverse_event_reports`](Tables/compliance/adverse_event_reports.md) | Transactional | Pharmacist_Review via Compliance owner | No current API; retain for future/operational scope |
| [`compliance.evidence`](Tables/compliance/evidence.md) | Transactional | Customer_Accounts via Privacy/Legal owner | No current API; retain for future/operational scope |
| [`compliance.legal_holds`](Tables/compliance/legal_holds.md) | Transactional | Customer_Accounts via Privacy/Legal owner | Customer_Accounts |
| [`compliance.privacy_requests`](Tables/compliance/privacy_requests.md) | Transactional | Customer_Accounts via Privacy/Legal owner | Customer_Accounts |
| [`compliance.product_recalls`](Tables/compliance/product_recalls.md) | Transactional | Pharmacist_Review via Compliance owner | No current API; retain for future/operational scope |
| [`compliance.recall_lots`](Tables/compliance/recall_lots.md) | Mapping / Junction | Pharmacist_Review via Compliance owner | No current API; retain for future/operational scope |
| [`compliance.regulatory_authorities`](Tables/compliance/regulatory_authorities.md) | Master / Reference | Pharmacist_Review via Compliance owner | No current API; retain for future/operational scope |
| [`compliance.regulatory_registrations`](Tables/compliance/regulatory_registrations.md) | Transactional | Pharmacist_Review via Compliance owner | No current API; retain for future/operational scope |
| [`customer.addresses`](Tables/customer/addresses.md) | Transactional | Customer_Accounts | Cart_Checkout, Customer_Accounts |
| [`customer.consent_events`](Tables/customer/consent_events.md) | Audit / History | Customer_Accounts | Customer_Accounts |
| [`customer.consents`](Tables/customer/consents.md) | Transactional | Customer_Accounts | Customer_Accounts |
| [`customer.family_members`](Tables/customer/family_members.md) | Mapping / Junction | Customer_Accounts | Cart_Checkout, Customer_Accounts, Prescription_Upload |
| [`customer.preferences`](Tables/customer/preferences.md) | Configuration | Customer_Accounts | No current API; retain for future/operational scope |
| [`customer.profiles`](Tables/customer/profiles.md) | Master / Reference | Customer_Accounts | Customer_Accounts |
| [`customer.wishlist_items`](Tables/customer/wishlist_items.md) | Mapping / Junction | Customer_Accounts | Customer_Accounts |
| [`customer.wishlists`](Tables/customer/wishlists.md) | Transactional | Customer_Accounts | Customer_Accounts |
| [`diagnostics.diagnostic_order_items`](Tables/diagnostics/diagnostic_order_items.md) | Transactional | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.diagnostic_orders`](Tables/diagnostics/diagnostic_orders.md) | Transactional | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.diagnostic_reports`](Tables/diagnostics/diagnostic_reports.md) | Transactional | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.diagnostic_result_values`](Tables/diagnostics/diagnostic_result_values.md) | Transactional | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.lab_locations`](Tables/diagnostics/lab_locations.md) | Mapping / Junction | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.lab_offerings`](Tables/diagnostics/lab_offerings.md) | Mapping / Junction | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.lab_providers`](Tables/diagnostics/lab_providers.md) | Master / Reference | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.sample_collections`](Tables/diagnostics/sample_collections.md) | Transactional | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.sample_events`](Tables/diagnostics/sample_events.md) | Audit / History | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.samples`](Tables/diagnostics/samples.md) | Transactional | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.test_definitions`](Tables/diagnostics/test_definitions.md) | Master / Reference | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.test_package_items`](Tables/diagnostics/test_package_items.md) | Mapping / Junction | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`diagnostics.test_packages`](Tables/diagnostics/test_packages.md) | Master / Reference | Future diagnostics owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`finance.accounts`](Tables/finance/accounts.md) | Master / Reference | Finance_Payments | No current API; retain for future/operational scope |
| [`finance.credit_notes`](Tables/finance/credit_notes.md) | Transactional | Finance_Payments | No current API; retain for future/operational scope |
| [`finance.invoice_items`](Tables/finance/invoice_items.md) | Transactional | Finance_Payments | Customer_Orders, Finance_Payments, Reporting |
| [`finance.invoices`](Tables/finance/invoices.md) | Transactional | Finance_Payments | Customer_Orders, Finance_Payments, Reporting |
| [`finance.journal_entries`](Tables/finance/journal_entries.md) | Transactional | Finance_Payments | No current API; retain for future/operational scope |
| [`finance.journal_lines`](Tables/finance/journal_lines.md) | Transactional | Finance_Payments | No current API; retain for future/operational scope |
| [`finance.settlement_items`](Tables/finance/settlement_items.md) | Transactional | Finance_Payments | No current API; retain for future/operational scope |
| [`finance.settlement_runs`](Tables/finance/settlement_runs.md) | Transactional | Finance_Payments | No current API; retain for future/operational scope |
| [`fulfillment.fulfillment_events`](Tables/fulfillment/fulfillment_events.md) | Audit / History | Store_Operations | Store_Operations |
| [`fulfillment.fulfillment_order_items`](Tables/fulfillment/fulfillment_order_items.md) | Transactional | Store_Operations | No current API; retain for future/operational scope |
| [`fulfillment.fulfillment_orders`](Tables/fulfillment/fulfillment_orders.md) | Transactional | Store_Operations | Customer_Orders, Order_Operations, Reporting, Rider_App, Store_Operations |
| [`fulfillment.pack_tasks`](Tables/fulfillment/pack_tasks.md) | Transactional | Store_Operations | Store_Operations |
| [`fulfillment.package_items`](Tables/fulfillment/package_items.md) | Mapping / Junction | Store_Operations | Store_Operations |
| [`fulfillment.packages`](Tables/fulfillment/packages.md) | Transactional | Store_Operations | Delivery_Operations, Reporting, Rider_App, Store_Operations |
| [`fulfillment.pick_task_items`](Tables/fulfillment/pick_task_items.md) | Transactional | Store_Operations | Store_Operations |
| [`fulfillment.pick_tasks`](Tables/fulfillment/pick_tasks.md) | Transactional | Store_Operations | Store_Operations |
| [`fulfillment.picking_wave_orders`](Tables/fulfillment/picking_wave_orders.md) | Mapping / Junction | Store_Operations | No current API; retain for future/operational scope |
| [`fulfillment.picking_waves`](Tables/fulfillment/picking_waves.md) | Derived / Operational | Store_Operations | No current API; retain for future/operational scope |
| [`identity.api_client_secrets`](Tables/identity/api_client_secrets.md) | Configuration | Authentication_Access | No current API; retain for future/operational scope |
| [`identity.api_clients`](Tables/identity/api_clients.md) | Configuration | Authentication_Access | No current API; retain for future/operational scope |
| [`identity.login_attempts`](Tables/identity/login_attempts.md) | Audit / History | Authentication_Access | Authentication_Access |
| [`identity.mfa_factors`](Tables/identity/mfa_factors.md) | Configuration | Authentication_Access | Authentication_Access |
| [`identity.otp_challenges`](Tables/identity/otp_challenges.md) | Transactional | Authentication_Access | Customer_Accounts |
| [`identity.password_history`](Tables/identity/password_history.md) | Audit / History | Authentication_Access | No current API; retain for future/operational scope |
| [`identity.permissions`](Tables/identity/permissions.md) | Master / Reference | Authentication_Access | Admin_CMS, Authentication_Access |
| [`identity.role_permissions`](Tables/identity/role_permissions.md) | Mapping / Junction | Authentication_Access | Authentication_Access |
| [`identity.roles`](Tables/identity/roles.md) | Master / Reference | Authentication_Access | Admin_CMS, Authentication_Access, Delivery_Operations |
| [`identity.sessions`](Tables/identity/sessions.md) | Transactional | Authentication_Access | Admin_CMS, Authentication_Access, Customer_Accounts |
| [`identity.trusted_devices`](Tables/identity/trusted_devices.md) | Configuration | Authentication_Access | No current API; retain for future/operational scope |
| [`identity.user_profiles`](Tables/identity/user_profiles.md) | Master / Reference | Authentication_Access | No current API; retain for future/operational scope |
| [`identity.user_roles`](Tables/identity/user_roles.md) | Mapping / Junction | Authentication_Access | Admin_CMS, Authentication_Access, Delivery_Operations |
| [`identity.users`](Tables/identity/users.md) | Master / Reference | Authentication_Access | Admin_CMS, Authentication_Access, Customer_Accounts, Delivery_Operations |
| [`insurance.claim_documents`](Tables/insurance/claim_documents.md) | Mapping / Junction | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.claim_status_history`](Tables/insurance/claim_status_history.md) | Audit / History | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.claims`](Tables/insurance/claims.md) | Transactional | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.eligibility_checks`](Tables/insurance/eligibility_checks.md) | Transactional | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.insurers`](Tables/insurance/insurers.md) | Master / Reference | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.policies`](Tables/insurance/policies.md) | Transactional | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.policy_members`](Tables/insurance/policy_members.md) | Mapping / Junction | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`insurance.tpas`](Tables/insurance/tpas.md) | Master / Reference | Future insurance owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`logistics.carrier_accounts`](Tables/logistics/carrier_accounts.md) | Configuration | Delivery_Operations | No current API; retain for future/operational scope |
| [`logistics.carriers`](Tables/logistics/carriers.md) | Master / Reference | Delivery_Operations | No current API; retain for future/operational scope |
| [`logistics.delivery_assignments`](Tables/logistics/delivery_assignments.md) | Transactional | Delivery_Operations | Admin_CMS, Delivery_Operations, Rider_App |
| [`logistics.delivery_attempts`](Tables/logistics/delivery_attempts.md) | Audit / History | Delivery_Operations | Delivery_Operations, Rider_App |
| [`logistics.delivery_failure_reasons`](Tables/logistics/delivery_failure_reasons.md) | Master / Reference | Delivery_Operations | Delivery_Operations, Rider_App |
| [`logistics.delivery_location_updates`](Tables/logistics/delivery_location_updates.md) | Audit / History | Delivery_Operations | Rider_App |
| [`logistics.delivery_otp_challenges`](Tables/logistics/delivery_otp_challenges.md) | Transactional | Delivery_Operations | Rider_App |
| [`logistics.delivery_routes`](Tables/logistics/delivery_routes.md) | Derived / Operational | Delivery_Operations | No current API; retain for future/operational scope |
| [`logistics.delivery_slots`](Tables/logistics/delivery_slots.md) | Derived / Operational | Delivery_Operations | No current API; retain for future/operational scope |
| [`logistics.ndr_cases`](Tables/logistics/ndr_cases.md) | Transactional | Delivery_Operations | Delivery_Operations, Rider_App |
| [`logistics.reverse_shipments`](Tables/logistics/reverse_shipments.md) | Transactional | Delivery_Operations | No current API; retain for future/operational scope |
| [`logistics.rider_shifts`](Tables/logistics/rider_shifts.md) | Transactional | Delivery_Operations | Delivery_Operations, Rider_App |
| [`logistics.serviceability_rules`](Tables/logistics/serviceability_rules.md) | Configuration | Delivery_Operations | Cart_Checkout, Order_Operations, Product_Catalog |
| [`logistics.shipment_events`](Tables/logistics/shipment_events.md) | Audit / History | Delivery_Operations | Rider_App |
| [`logistics.shipments`](Tables/logistics/shipments.md) | Transactional | Delivery_Operations | Admin_CMS, Customer_Orders, Delivery_Operations, Reporting, Rider_App |
| [`marketplace.commission_plans`](Tables/marketplace/commission_plans.md) | Configuration | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`marketplace.seller_commission_assignments`](Tables/marketplace/seller_commission_assignments.md) | Mapping / Junction | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`marketplace.seller_locations`](Tables/marketplace/seller_locations.md) | Mapping / Junction | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`marketplace.seller_product_listings`](Tables/marketplace/seller_product_listings.md) | Mapping / Junction | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`marketplace.seller_ratings`](Tables/marketplace/seller_ratings.md) | Transactional | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`marketplace.seller_service_levels`](Tables/marketplace/seller_service_levels.md) | Configuration | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`marketplace.sellers`](Tables/marketplace/sellers.md) | Master / Reference | Future marketplace owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`membership.benefit_usage`](Tables/membership/benefit_usage.md) | Transactional | Future membership owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`membership.loyalty_accounts`](Tables/membership/loyalty_accounts.md) | Derived / Operational | Future membership owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`membership.loyalty_ledger`](Tables/membership/loyalty_ledger.md) | Audit / History | Future membership owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`membership.plan_benefits`](Tables/membership/plan_benefits.md) | Configuration | Future membership owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`membership.plans`](Tables/membership/plans.md) | Master / Reference | Future membership owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`membership.subscriptions`](Tables/membership/subscriptions.md) | Transactional | Future membership owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`notification.device_endpoints`](Tables/notification/device_endpoints.md) | Configuration | Notifications | Notifications |
| [`notification.in_app_notifications`](Tables/notification/in_app_notifications.md) | Transactional | Notifications | No current API; retain for future/operational scope |
| [`notification.message_attachments`](Tables/notification/message_attachments.md) | Mapping / Junction | Notifications | No current API; retain for future/operational scope |
| [`notification.message_attempts`](Tables/notification/message_attempts.md) | Audit / History | Notifications | Notifications |
| [`notification.messages`](Tables/notification/messages.md) | Transactional | Notifications | Notifications |
| [`notification.provider_configurations`](Tables/notification/provider_configurations.md) | Configuration | Notifications | Notifications |
| [`notification.provider_webhooks`](Tables/notification/provider_webhooks.md) | Audit / History | Notifications | No current API; retain for future/operational scope |
| [`notification.suppressions`](Tables/notification/suppressions.md) | Configuration | Notifications | Notifications |
| [`notification.templates`](Tables/notification/templates.md) | Configuration | Notifications | Notifications |
| [`notification.user_channel_preferences`](Tables/notification/user_channel_preferences.md) | Configuration | Notifications | Notifications |
| [`organization.bank_accounts`](Tables/organization/bank_accounts.md) | Configuration | Admin_CMS | No current API; retain for future/operational scope |
| [`organization.departments`](Tables/organization/departments.md) | Master / Reference | Admin_CMS | No current API; retain for future/operational scope |
| [`organization.licenses`](Tables/organization/licenses.md) | Transactional | Admin_CMS | Inventory, Order_Operations, Product_Catalog, Rider_App, Store_Operations, Warehouse |
| [`organization.locations`](Tables/organization/locations.md) | Master / Reference | Admin_CMS | Admin_CMS, Delivery_Operations, Inventory, Order_Operations, Product_Catalog, Warehouse |
| [`organization.memberships`](Tables/organization/memberships.md) | Mapping / Junction | Admin_CMS | Admin_CMS, Delivery_Operations, Order_Operations, Pharmacist_Review, Reporting, Store_Operations |
| [`organization.organizations`](Tables/organization/organizations.md) | Master / Reference | Admin_CMS | Admin_CMS |
| [`payment.chargebacks`](Tables/payment/chargebacks.md) | Transactional | Finance_Payments | No current API; retain for future/operational scope |
| [`payment.cod_collections`](Tables/payment/cod_collections.md) | Transactional | Finance_Payments | Delivery_Operations, Finance_Payments, Rider_App |
| [`payment.customer_payment_methods`](Tables/payment/customer_payment_methods.md) | Configuration | Finance_Payments | No current API; retain for future/operational scope |
| [`payment.payment_attempts`](Tables/payment/payment_attempts.md) | Transactional | Finance_Payments | Finance_Payments |
| [`payment.payment_intents`](Tables/payment/payment_intents.md) | Transactional | Finance_Payments | Finance_Payments, Rider_App |
| [`payment.payment_transactions`](Tables/payment/payment_transactions.md) | Transactional | Finance_Payments | Finance_Payments |
| [`payment.payment_webhooks`](Tables/payment/payment_webhooks.md) | Audit / History | Finance_Payments | Finance_Payments |
| [`payment.provider_accounts`](Tables/payment/provider_accounts.md) | Configuration | Finance_Payments | Finance_Payments |
| [`payment.reconciliation_items`](Tables/payment/reconciliation_items.md) | Transactional | Finance_Payments | Finance_Payments |
| [`payment.reconciliation_runs`](Tables/payment/reconciliation_runs.md) | Transactional | Finance_Payments | Finance_Payments |
| [`payment.refund_allocations`](Tables/payment/refund_allocations.md) | Transactional | Finance_Payments | Finance_Payments |
| [`payment.refund_reason_codes`](Tables/payment/refund_reason_codes.md) | Master / Reference | Finance_Payments | Finance_Payments |
| [`payment.refunds`](Tables/payment/refunds.md) | Transactional | Finance_Payments | Customer_Orders, Finance_Payments |
| [`platform.application_settings`](Tables/platform/application_settings.md) | Configuration | Admin_CMS | Admin_CMS, Cart_Checkout |
| [`platform.audit_logs`](Tables/platform/audit_logs.md) | Audit / History | Audit | Audit |
| [`platform.cms_banners`](Tables/platform/cms_banners.md) | Configuration | Admin_CMS | No current API; retain for future/operational scope |
| [`platform.cms_page_versions`](Tables/platform/cms_page_versions.md) | Audit / History | Admin_CMS | Admin_CMS |
| [`platform.cms_pages`](Tables/platform/cms_pages.md) | Configuration | Admin_CMS | Admin_CMS |
| [`platform.data_retention_policies`](Tables/platform/data_retention_policies.md) | Configuration | Admin_CMS | No current API; retain for future/operational scope |
| [`platform.feature_flags`](Tables/platform/feature_flags.md) | Configuration | Admin_CMS | No current API; retain for future/operational scope |
| [`platform.file_access_events`](Tables/platform/file_access_events.md) | Audit / History | Shared platform file service — engineering owner; no clinical write grant | No current API; retain for future/operational scope |
| [`platform.file_access_grants`](Tables/platform/file_access_grants.md) | Mapping / Junction | Shared platform file service — engineering owner; no clinical write grant | Customer_Orders, Finance_Payments, Rider_App |
| [`platform.file_objects`](Tables/platform/file_objects.md) | Derived / Operational | Shared platform file service — engineering owner; no clinical write grant | Customer_Orders, Finance_Payments, Prescription_Upload, Product_Catalog, Rider_App |
| [`platform.file_scan_events`](Tables/platform/file_scan_events.md) | Audit / History | Shared platform file service — engineering owner; no clinical write grant | No current API; retain for future/operational scope |
| [`platform.file_upload_sessions`](Tables/platform/file_upload_sessions.md) | Derived / Operational | Shared platform file service — engineering owner; no clinical write grant | Prescription_Upload |
| [`platform.file_variants`](Tables/platform/file_variants.md) | Mapping / Junction | Shared platform file service — engineering owner; no clinical write grant | No current API; retain for future/operational scope |
| [`platform.idempotency_keys`](Tables/platform/idempotency_keys.md) | Derived / Operational | Shared platform runtime — engineering owner | No current API; retain for future/operational scope |
| [`platform.inbox_messages`](Tables/platform/inbox_messages.md) | Derived / Operational | Shared platform runtime — engineering owner | No current API; retain for future/operational scope |
| [`platform.outbox_events`](Tables/platform/outbox_events.md) | Derived / Operational | Shared platform runtime — engineering owner | Notifications |
| [`platform.report_definitions`](Tables/platform/report_definitions.md) | Configuration | Reporting | Audit, Reporting |
| [`platform.report_runs`](Tables/platform/report_runs.md) | Derived / Operational | Reporting | Audit, Reporting |
| [`platform.scheduled_jobs`](Tables/platform/scheduled_jobs.md) | Derived / Operational | Shared platform runtime — engineering owner | Product_Catalog |
| [`platform.webhook_deliveries`](Tables/platform/webhook_deliveries.md) | Transactional | Shared platform runtime — engineering owner | No current API; retain for future/operational scope |
| [`platform.webhook_endpoints`](Tables/platform/webhook_endpoints.md) | Configuration | Shared platform runtime — engineering owner | No current API; retain for future/operational scope |
| [`pricing.coupon_codes`](Tables/pricing/coupon_codes.md) | Configuration | Product_Catalog | Cart_Checkout |
| [`pricing.price_books`](Tables/pricing/price_books.md) | Configuration | Product_Catalog | Cart_Checkout, Product_Catalog |
| [`pricing.pricing_evaluations`](Tables/pricing/pricing_evaluations.md) | Derived / Operational | Product_Catalog | No current API; retain for future/operational scope |
| [`pricing.product_prices`](Tables/pricing/product_prices.md) | Configuration | Product_Catalog | Cart_Checkout, Order_Operations, Product_Catalog |
| [`pricing.promotion_redemptions`](Tables/pricing/promotion_redemptions.md) | Transactional | Product_Catalog | Cart_Checkout |
| [`pricing.promotion_versions`](Tables/pricing/promotion_versions.md) | Audit / History | Product_Catalog | Cart_Checkout |
| [`pricing.promotions`](Tables/pricing/promotions.md) | Configuration | Product_Catalog | Cart_Checkout |
| [`pricing.tax_rules`](Tables/pricing/tax_rules.md) | Configuration | Finance_Payments | Cart_Checkout, Order_Operations, Product_Catalog |
| [`procurement.goods_receipt_items`](Tables/procurement/goods_receipt_items.md) | Transactional | Warehouse | Warehouse |
| [`procurement.goods_receipt_quality_checks`](Tables/procurement/goods_receipt_quality_checks.md) | Transactional | Warehouse | Warehouse |
| [`procurement.goods_receipts`](Tables/procurement/goods_receipts.md) | Transactional | Warehouse | Warehouse |
| [`procurement.purchase_order_items`](Tables/procurement/purchase_order_items.md) | Transactional | Warehouse | Warehouse |
| [`procurement.purchase_orders`](Tables/procurement/purchase_orders.md) | Transactional | Warehouse | Warehouse |
| [`procurement.purchase_requisition_items`](Tables/procurement/purchase_requisition_items.md) | Transactional | Warehouse | Store_Operations, Warehouse |
| [`procurement.purchase_requisitions`](Tables/procurement/purchase_requisitions.md) | Transactional | Warehouse | Store_Operations, Warehouse |
| [`procurement.purchase_return_items`](Tables/procurement/purchase_return_items.md) | Transactional | Warehouse | No current API; retain for future/operational scope |
| [`procurement.purchase_returns`](Tables/procurement/purchase_returns.md) | Transactional | Warehouse | No current API; retain for future/operational scope |
| [`procurement.supplier_invoices`](Tables/procurement/supplier_invoices.md) | Transactional | Warehouse | Warehouse |
| [`procurement.supplier_licenses`](Tables/procurement/supplier_licenses.md) | Transactional | Warehouse | No current API; retain for future/operational scope |
| [`procurement.supplier_products`](Tables/procurement/supplier_products.md) | Mapping / Junction | Warehouse | No current API; retain for future/operational scope |
| [`procurement.suppliers`](Tables/procurement/suppliers.md) | Master / Reference | Warehouse | Warehouse |
| [`risk.assessments`](Tables/risk/assessments.md) | Derived / Operational | Future risk owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`risk.blocklists`](Tables/risk/blocklists.md) | Configuration | Future risk owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`risk.cases`](Tables/risk/cases.md) | Transactional | Future risk owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`risk.rules`](Tables/risk/rules.md) | Configuration | Future risk owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`risk.signals`](Tables/risk/signals.md) | Transactional | Future risk owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`search.documents`](Tables/search/documents.md) | Derived / Operational | Product_Catalog | Product_Catalog |
| [`search.indexing_jobs`](Tables/search/indexing_jobs.md) | Derived / Operational | Product_Catalog | No current API; retain for future/operational scope |
| [`search.query_events`](Tables/search/query_events.md) | Audit / History | Product_Catalog | No current API; retain for future/operational scope |
| [`search.redirects`](Tables/search/redirects.md) | Configuration | Product_Catalog | No current API; retain for future/operational scope |
| [`search.synonyms`](Tables/search/synonyms.md) | Configuration | Product_Catalog | Product_Catalog |
| [`support.sla_policies`](Tables/support/sla_policies.md) | Configuration | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.ticket_actions`](Tables/support/ticket_actions.md) | Audit / History | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.ticket_attachments`](Tables/support/ticket_attachments.md) | Mapping / Junction | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.ticket_messages`](Tables/support/ticket_messages.md) | Audit / History | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.ticket_status_history`](Tables/support/ticket_status_history.md) | Audit / History | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.ticket_tag_assignments`](Tables/support/ticket_tag_assignments.md) | Mapping / Junction | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.ticket_tags`](Tables/support/ticket_tags.md) | Master / Reference | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`support.tickets`](Tables/support/tickets.md) | Transactional | Future support owner — Requires Decision D-027 | No current API; retain for future/operational scope |
| [`warehouse.aisles`](Tables/warehouse/aisles.md) | Master / Reference | Warehouse | No current API; retain for future/operational scope |
| [`warehouse.bins`](Tables/warehouse/bins.md) | Master / Reference | Warehouse | No current API; retain for future/operational scope |
| [`warehouse.cycle_count_items`](Tables/warehouse/cycle_count_items.md) | Transactional | Inventory | No current API; retain for future/operational scope |
| [`warehouse.cycle_counts`](Tables/warehouse/cycle_counts.md) | Transactional | Inventory | No current API; retain for future/operational scope |
| [`warehouse.inventory_adjustment_items`](Tables/warehouse/inventory_adjustment_items.md) | Transactional | Inventory | Inventory |
| [`warehouse.inventory_adjustments`](Tables/warehouse/inventory_adjustments.md) | Transactional | Inventory | Inventory |
| [`warehouse.inventory_lots`](Tables/warehouse/inventory_lots.md) | Transactional | Inventory | Inventory, Order_Operations, Product_Catalog, Reporting, Store_Operations, Warehouse |
| [`warehouse.racks`](Tables/warehouse/racks.md) | Master / Reference | Warehouse | No current API; retain for future/operational scope |
| [`warehouse.replenishment_rules`](Tables/warehouse/replenishment_rules.md) | Configuration | Warehouse | Inventory, Store_Operations |
| [`warehouse.stock_balances`](Tables/warehouse/stock_balances.md) | Derived / Operational | Inventory | Admin_CMS, Inventory, Order_Operations, Product_Catalog, Reporting, Warehouse |
| [`warehouse.stock_holds`](Tables/warehouse/stock_holds.md) | Transactional | Inventory | Inventory |
| [`warehouse.stock_ledger`](Tables/warehouse/stock_ledger.md) | Audit / History | Inventory | No current API; retain for future/operational scope |
| [`warehouse.stock_movement_reason_codes`](Tables/warehouse/stock_movement_reason_codes.md) | Master / Reference | Inventory | Inventory |
| [`warehouse.stock_reservations`](Tables/warehouse/stock_reservations.md) | Transactional | Inventory | Finance_Payments, Inventory, Rider_App, Store_Operations |
| [`warehouse.stock_transfer_items`](Tables/warehouse/stock_transfer_items.md) | Transactional | Warehouse | Store_Operations, Warehouse |
| [`warehouse.stock_transfers`](Tables/warehouse/stock_transfers.md) | Transactional | Warehouse | Store_Operations, Warehouse |
| [`warehouse.warehouses`](Tables/warehouse/warehouses.md) | Master / Reference | Warehouse | Inventory, Order_Operations, Reporting, Store_Operations, Warehouse |
| [`warehouse.zones`](Tables/warehouse/zones.md) | Master / Reference | Warehouse | No current API; retain for future/operational scope |
