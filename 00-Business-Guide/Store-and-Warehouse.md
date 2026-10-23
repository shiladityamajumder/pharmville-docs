# Store and warehouse work

**Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Store and warehouse teams prepare correct parcels and replenish locations. A dispatched transfer is not yet stock received by the destination.

## Who is involved?

Store workers/managers, warehouse receivers/pickers, Inventory, supplier contacts, Operations and riders.

## How does it normally work?

1. Workers sign in to their assigned location, see incoming queues and accept only permitted tasks.
2. Workers follow the exact product, batch and quantity on the pick list. Shortages are reported rather than replaced by a different medicine.
3. Packing rechecks accepted contents, current prescription decisions, license and reserved stock. Staff record packages and hand over only after dispatch gates pass.
4. Stores request replenishment. Warehouse staff review it, pick eligible batches and record transfer quantities and dispatch notes as in transit.
5. The destination counts actual received quantities and shortages before stock is credited. Supplier receiving also records invoice, batch, manufacturing/expiry dates and required quality checks.
6. Warehouse fallback orders obey the same gates as store orders. A warehouse label alone does not authorize medicine dispensing.

A basic warehouse stock audit is a draft optional feature. If included, staff compare actual batch counts with the recorded movements and request reasoned Inventory adjustments; counting is not permission to overwrite stock.

## What happens next?

Customer parcels go to [delivery](Delivery-and-Rider-App.md); receipts and discrepancies go to [Inventory](Inventory-and-Stock.md).

## What can go wrong, and what does the system do?

### The worker is assigned to the wrong site

An old link or bad assignment cannot authorize another store’s task. Pharmville denies the action, explains access and changes no stock or task there. A manager corrects assignment before work resumes.

### The batch is expired or wrong

A shelf error or similar pack can cause mismatch. Packing stops and Inventory/Pharmacy review the item. The customer sees delay; no unsafe parcel is handed over or silently substituted.

### Receiving finds shortage or damage

Counting errors or transit damage reduce usable supply. Staff record actual accepted quantity and discrepancy. Inventory credits only accepted goods; Operations/procurement investigate while Finance retains the unmatched invoice evidence.

### Receiving or handoff is repeated

A scanner retry or dropped response may repeat the command. The saved outcome is returned and stock is credited or handed off once. Staff refresh the task; Inventory resolves any discrepancy.

### A site or urgent run is unavailable

Closure or an interrupted route leaves supply waiting. Operations arranges an approved alternative and communicates delay. The inherited two-extra-runs figure remains draft; in-transit stock is not treated as received.

## What does the user see?

Workers see their location queue, exact pick list, packing gates, transfer note, accepted receipt quantity and shortage reasons. Customers see evidenced preparation progress.

## What still needs approval?

D-002 (warehouse scope), D-006/D-009 (licensed stock), D-010 (fallback/transfers). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Store Operations | [HLD](../03-Modules/Store_Operations/HLD.md) | [LLD](../03-Modules/Store_Operations/LLD.md) | [API](../05-APIs/Store_Operations.md) | [Mapping](../04-Database/Module-Mapping.md#store-operations) | [Cases](../03-Modules/Store_Operations/Edge-Cases.md) |
| Warehouse | [HLD](../03-Modules/Warehouse/HLD.md) | [LLD](../03-Modules/Warehouse/LLD.md) | [API](../05-APIs/Warehouse.md) | [Mapping](../04-Database/Module-Mapping.md#warehouse) | [Cases](../03-Modules/Warehouse/Edge-Cases.md) |

Technical workflows: [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) · [WF-007](../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) · [WF-014](../06-Workflows/WF-014-Supplier-Receiving.md).

Feature references: `STO-01`, `STO-02`, `STO-03`, `STO-04`, `STO-05`, `WH-01`, `WH-02`, `WH-03`, `WH-04`, `WH-05`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
