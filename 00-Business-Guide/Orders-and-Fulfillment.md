# Orders and fulfillment

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

An order coordinates the teams supplying a customer’s accepted purchase. The timeline explains progress while keeping payment, prescription, stock and delivery facts distinct.

## Who is involved?

Customers, order operations, pharmacists, store/warehouse teams, dispatchers, riders, Finance and support.

## How does it normally work?

1. Pharmville records one request and shows the outstanding review/payment step. Request receipt is not proof of payment.
2. Operations chooses an eligible open store with the whole basket. Warehouse fallback remains subject to scope, stock and licensed-site approval.
3. Inventory supplies the exact hold. Workers accept the task, pick the recorded batches, recheck clinical approval and pack accepted items.
4. After fulfillment checks and verified online payment or approved COD, staff hand the parcel to the assigned rider. Missing safety or money evidence prevents dispatch.
5. The customer follows placed, packed, out-for-delivery and delivered milestones backed by actual work, and can open history, invoice, permitted tracking and OTP.
6. Operations follows attention queues for uncertain money, stalled preparation and failed deliveries. Support explains the same recorded facts.

## What happens next?

Prepared parcels enter [delivery](Delivery-and-Rider-App.md). Exceptions can enter [returns/refunds](Returns-and-Refunds.md).

## What can go wrong, and what does the system do?

### No location can supply the whole basket

Closure, expired license, stale stock or missing packs can eliminate every candidate. Operations keeps the order blocked and offers approved waiting, revision or cancellation. The customer sees an action/delay status; no silent site split occurs and paid money remains Finance’s responsibility.

### Stock fails after checkout

A physical shortage or blocked batch stops picking. Staff record the discrepancy. Operations considers permitted reassignment or customer-approved revision; Finance handles any required refund. The customer sees preparation delayed, not packed.

### Reassignment or cancellation races with packing

Operators and customers may act on old screens. Pharmville accepts only a valid current transition; others refresh. Unused holds are released through Inventory, not duplicated across sites. Cancellation follows the draft before-packed rule or moves to the approved support/return path.

### The customer requests an edit after placing

ORD-09 remains a draft Could feature. Address/item changes can invalidate price, serviceability, patient approval and stock. Staff route for review until its contract is approved; they do not silently rewrite the accepted order.

## What does the user see?

Customers see recorded milestones, permitted invoice/tracking access and eligible cancellation/return actions. Operators see site, task and exception reasons.

## What still needs approval?

D-004 (payment/cancellation), D-009 (site eligibility), D-010 (partial supply/reassignment). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Customer Orders | [HLD](../03-Modules/Customer-Orders/HLD.md) | [LLD](../03-Modules/Customer-Orders/LLD.md) | [API](../03-Modules/Customer-Orders/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#customer-orders) | [Cases](../03-Modules/Customer-Orders/Edge-Cases.md) |
| Order Operations | [HLD](../03-Modules/Order-Management/HLD.md) | [LLD](../03-Modules/Order-Management/LLD.md) | [API](../03-Modules/Order-Management/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#order-operations) | [Cases](../03-Modules/Order-Management/Edge-Cases.md) |

Technical workflows: [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) · [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) · [WF-007](../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) · [WF-008](../06-Workflows/WF-008-Rider-Assignment-and-POD.md) · [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md).

Feature references: `ORD-01`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `ORD-08`, `ORD-09`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `OMS-06`, `OMS-07`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
