# Cancellations, returns and refunds

**Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

This process handles orders that cannot continue and delivered items that may qualify for return. Cancelling, accepting goods back and returning money are separate decisions.

## Who is involved?

Customers, support, Operations, store receivers, Pharmacy, Finance approvers and the provider.

## How does it normally work?

1. The customer requests cancellation or return with a reason. Draft customer cancellation is before packed; return window and eligible products await approval.
2. Pharmville checks current item/order state. Operations accepts or refuses with a reason; a request is not itself return receipt or refund completion.
3. An accepted cancellation stops eligible unfinished work. Inventory releases unused holds once; committed stock needs the approved compensating movement.
4. An approved return is tracked back and inspected for actual item/quantity. Medicine is not automatically saleable when received.
5. Finance checks paid value, previous refunds, approvals and destination, sends one refund instruction and tracks trusted results. The customer sees requested, review, pending, completed or refused; required credit notes follow approved policy.

## What happens next?

Completed refunds enter [reconciliation](Finance-and-Reconciliation.md). Accepted goods enter inventory safety review; refusals remain explained support outcomes.

## What can go wrong, and what does the system do?

### Cancellation races with packing

An old screen may show cancellation available after a worker packs. Only a valid current transition wins. The customer sees accepted or a current eligibility explanation; Operations/support considers remaining options. The order cannot be newly packed and cancelled by competing stale actions.

### The item is outside policy or unsafe to resell

Window, item type, damage or unknown storage may prevent return or resale. Pharmville explains the decision and support route. Pharmacy/Product approve eligibility; receiving keeps unsafe goods out of saleable stock, independently of any refund decision.

### Refund submission or callback repeats

A timeout can encourage resubmission. Finance reuses the instruction/result and checks cumulative refunded value. The customer sees one reference; no duplicate payout is made.

### Money is delayed or COD has no verified destination

Provider uncertainty leaves refund pending, with a reference for Finance to investigate. COD may require an approved verified bank/UPI destination. The customer sees pending or awaiting details; no fixed arrival time or transfer to unverified details is promised.

## What does the user see?

Customers see request eligibility, accepted/refused reason and separate refund progress/reference. Receiving and Finance staff see their own pending inspection or payout work.

## What still needs approval?

D-004 (cancellation/refund), D-006/D-009 (medicine safety), D-008/D-012 (accounting), D-010 (partial outcomes). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Customer Orders | [HLD](../03-Modules/Customer_Orders/HLD.md) | [LLD](../03-Modules/Customer_Orders/LLD.md) | [API](../05-APIs/Customer_Orders.md) | [Mapping](../04-Database/Module-Mapping.md#customer-orders) | [Cases](../03-Modules/Customer_Orders/Edge-Cases.md) |
| Order Operations | [HLD](../03-Modules/Order_Operations/HLD.md) | [LLD](../03-Modules/Order_Operations/LLD.md) | [API](../05-APIs/Order_Operations.md) | [Mapping](../04-Database/Module-Mapping.md#order-operations) | [Cases](../03-Modules/Order_Operations/Edge-Cases.md) |
| Finance Payments | [HLD](../03-Modules/Finance_Payments/HLD.md) | [LLD](../03-Modules/Finance_Payments/LLD.md) | [API](../05-APIs/Finance_Payments.md) | [Mapping](../04-Database/Module-Mapping.md#finance-payments) | [Cases](../03-Modules/Finance_Payments/Edge-Cases.md) |

Technical workflows: [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md).

Feature references: `ORD-04`, `ORD-05`, `ORD-06`, `OMS-05`, `FIN-03`, `FIN-04`, `FIN-07`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
