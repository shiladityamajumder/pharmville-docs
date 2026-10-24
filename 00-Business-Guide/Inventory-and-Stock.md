# Inventory and stock

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Inventory tracks usable packs by location and batch and prevents the same pack being promised twice. Every movement retains its reason, including receipts, holds, dispatch and approved corrections.

## Who is involved?

Inventory controllers, store/warehouse staff, Operations managers, pharmacists and the stock integration owner.

## How does it normally work?

1. Staff establish opening stock for the correct batch/location through a reviewed import. Subsequent movements keep an explained stock record.
2. Pharmville receives observations from the approved stock source, currently a proposed Techsmith integration. Operations must approve the authority and permitted age.
3. Before a hold, Pharmville checks location, batch, expiry, available quantity and fresh evidence. Nearest-expiry allocation only selects batches meeting the approved shelf-life rule.
4. A temporary hold protects the exact order version during payment. It is committed to fulfillment or released once when unused and expired/cancelled.
5. Staff review low-stock/expiry alerts. Adjustments need a reason and configured approval; physical counts and external observations are reconciled rather than silently overwriting history.

## What happens next?

Valid holds support [checkout](Cart-and-Checkout.md) and [picking](Store-and-Warehouse.md). Shortages trigger replenishment or order review.

## What can go wrong, and what does the system do?

### Two customers want the last pack

Both may see availability. Only one eligible hold succeeds; the other customer revises or waits. Inventory owns the result and the available quantity never becomes negative.

### The feed is late or offline

An outage makes previously plausible stock unsafe. Missing/stale evidence blocks new holds under approved policy. The customer sees availability cannot be confirmed; the integration owner restores and reconciles the feed.

### A held batch becomes expired or blocked

Time or safety updates may invalidate a pack. Staff cannot pick it. Pharmacy/Inventory check permitted replacements, Operations seeks required consent, and Finance handles paid-but-unsuppliable outcomes. The order remains blocked until resolved.

### Expiry processing repeats or races with payment

A restarted worker can repeat release while payment finishes. The current hold/version decides one permitted outcome; committed stock is not restored by a stale release. Inventory/Finance resolve uncertainty and the customer sees pending review.

### An import or count disagrees

A bad sheet or physical discrepancy produces row errors/reconciliation work. Inventory reviews reasons and required approvals; no unapproved stock becomes orderable and original movements remain traceable.

## What does the user see?

Staff see batch/location balances, held quantities, expiry/staleness warnings and reasoned discrepancies. Customers see current availability or a specific inability to secure stock.

## What still needs approval?

D-005 (Techsmith authority/freshness), D-009 (lot/hold rules), D-010 (fallback). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Inventory | [HLD](../03-Modules/Inventory/HLD.md) | [LLD](../03-Modules/Inventory/LLD.md) | [API](../03-Modules/Inventory/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#inventory) | [Cases](../03-Modules/Inventory/Edge-Cases.md) |

Technical workflows: [WF-003](../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) · [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) · [WF-011](../06-Workflows/WF-011-Inventory-Reconciliation.md) · [WF-014](../06-Workflows/WF-014-Supplier-Receiving.md).

Feature references: `INV-01`, `INV-02`, `INV-03`, `INV-04`, `INV-05`, `INV-06`, `INV-07`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
