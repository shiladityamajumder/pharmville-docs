# Module to database mapping

<!-- ERD-MODULE-MAP-START -->

## ER diagram navigation

This table links a feature module to the actual database schemas it may read or write; it does not assign exclusive ownership. The candidate modules are inherited from the existing module-to-database map.

| Module | Database ER diagrams |
|---|---|
| [Admin_CMS](../03-Modules/Admin_CMS/README.md) | [`organization`](ER-Diagrams/16-organization.md), [`platform`](ER-Diagrams/18-platform.md) |
| [Audit](../03-Modules/Audit/README.md) | [`compliance`](ER-Diagrams/05-compliance.md), [`platform`](ER-Diagrams/18-platform.md), [`risk`](ER-Diagrams/21-risk.md) |
| [Authentication_Access](../03-Modules/Authentication_Access/README.md) | [`identity`](ER-Diagrams/10-identity.md), [`organization`](ER-Diagrams/16-organization.md) |
| [Cart_Checkout](../03-Modules/Cart_Checkout/README.md) | [`commerce`](ER-Diagrams/04-commerce.md), [`pricing`](ER-Diagrams/19-pricing.md), [`warehouse`](ER-Diagrams/24-warehouse.md) |
| [Customer_Accounts](../03-Modules/Customer_Accounts/README.md) | [`customer`](ER-Diagrams/06-customer.md), [`identity`](ER-Diagrams/10-identity.md), [`clinical`](ER-Diagrams/03-clinical.md) |
| [Customer_Orders](../03-Modules/Customer_Orders/README.md) | [`commerce`](ER-Diagrams/04-commerce.md), [`logistics`](ER-Diagrams/12-logistics.md) |
| [Delivery_Operations](../03-Modules/Delivery_Operations/README.md) | [`logistics`](ER-Diagrams/12-logistics.md), [`organization`](ER-Diagrams/16-organization.md) |
| [Finance_Payments](../03-Modules/Finance_Payments/README.md) | [`payment`](ER-Diagrams/17-payment.md), [`finance`](ER-Diagrams/08-finance.md), [`commerce`](ER-Diagrams/04-commerce.md) |
| [Inventory](../03-Modules/Inventory/README.md) | [`warehouse`](ER-Diagrams/24-warehouse.md), [`catalog`](ER-Diagrams/02-catalog.md), [`procurement`](ER-Diagrams/20-procurement.md) |
| [Notifications](../03-Modules/Notifications/README.md) | [`notification`](ER-Diagrams/15-notification.md), [`platform`](ER-Diagrams/18-platform.md) |
| [Order_Operations](../03-Modules/Order_Operations/README.md) | [`commerce`](ER-Diagrams/04-commerce.md), [`fulfillment`](ER-Diagrams/09-fulfillment.md), [`organization`](ER-Diagrams/16-organization.md) |
| [Pharmacist_Review](../03-Modules/Pharmacist_Review/README.md) | [`clinical`](ER-Diagrams/03-clinical.md), [`commerce`](ER-Diagrams/04-commerce.md) |
| [Prescription_Upload](../03-Modules/Prescription_Upload/README.md) | [`clinical`](ER-Diagrams/03-clinical.md), [`platform`](ER-Diagrams/18-platform.md) |
| [Product_Catalog](../03-Modules/Product_Catalog/README.md) | [`catalog`](ER-Diagrams/02-catalog.md), [`marketplace`](ER-Diagrams/13-marketplace.md), [`pricing`](ER-Diagrams/19-pricing.md), [`search`](ER-Diagrams/22-search.md) |
| [Reporting](../03-Modules/Reporting/README.md) | [`platform`](ER-Diagrams/18-platform.md), [`finance`](ER-Diagrams/08-finance.md) |
| [Rider_App](../03-Modules/Rider_App/README.md) | [`identity`](ER-Diagrams/10-identity.md), [`logistics`](ER-Diagrams/12-logistics.md), [`notification`](ER-Diagrams/15-notification.md) |
| [Store_Operations](../03-Modules/Store_Operations/README.md) | [`fulfillment`](ER-Diagrams/09-fulfillment.md), [`warehouse`](ER-Diagrams/24-warehouse.md), [`procurement`](ER-Diagrams/20-procurement.md) |
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
