# Delivery and the rider app

**Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Delivery moves a prepared parcel to its customer and records the outcome. Tracking helps coordination; a map position is not proof of delivery or cash settlement.

## Who is involved?

Dispatchers, assigned riders, customers, handoff staff, support and Finance.

## How does it normally work?

1. Riders sign in, start authorized shifts and set availability. Dispatchers see eligible riders and ready parcels.
2. Pharmville suggests a nearby available rider; staff confirm or choose another. Riders see only necessary assigned-delivery information.
3. The rider accepts, records pickup and opens navigation. The customer sees delivery progress, permitted tracking, estimated arrival and masked calling.
4. At the doorstep, the rider requests the customer OTP and approved photo evidence. Pharmville checks proof for the current assignment before accepting completion.
5. COD actual collection is recorded separately from delivery completion and later deposit. Failed attempts receive an approved reason; dispatch selects a permitted reattempt, reschedule or return.

## What happens next?

Delivery completion ends this leg. [Finance](Finance-and-Reconciliation.md) checks cash; failed/returned parcels enter [exception handling](Returns-and-Refunds.md).

## What can go wrong, and what does the system do?

### No rider is available

Busy or off-duty riders leave the parcel ready and unassigned. Dispatch arranges an eligible rider or an approved revised promise. The customer sees awaiting assignment, not out for delivery; parcel stock stays tracked.

### The OTP is wrong

A typo, old code or wrong doorstep prevents completion. The rider sees verification failed, retries only within approved limits or contacts dispatch. Delivery stays incomplete; no collection or refund is invented.

### The device goes offline

Tracking and acknowledgments may stop. The app shows pending actions; customers see the last known update, not a false live point. On reconnect the server rechecks assignment/state/evidence before accepting replay. Dispatch resolves conflicts; offline storage and replay details require their reviewed contract.

### The customer is absent or refuses

The rider records the actual reason. Dispatch chooses an approved next action and support communicates it. Stock remains with the tracked parcel until receiving; money and COD balances are not automatically cleared.

### A reassigned rider replays completion

An old task screen cannot authorize delivery. Pharmville rejects stale assignment actions and asks the rider to refresh/contact dispatch. One current assignment can complete; Finance must not count cash twice.

### A tracking link exposes unrelated information

An old link or wrong role must not reveal another customer’s route or prescription. Access is denied; Security reviews suspected disclosure while authorized work continues with minimum details.

## What does the user see?

Riders see assigned tasks, current custody and proof result; customers see permitted tracking, OTP, last update and delivery/attempt status. Dispatch sees unassigned and failed work.

## What still needs approval?

D-007 (COD), D-011 (location/proof), D-021 (Android scope); RID-05 door checks and RID-07 incentives remain draft. The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Delivery Operations | [HLD](../03-Modules/Delivery_Operations/HLD.md) | [LLD](../03-Modules/Delivery_Operations/LLD.md) | [API](../05-APIs/Delivery_Operations.md) | [Mapping](../04-Database/Module-Mapping.md#delivery-operations) | [Cases](../03-Modules/Delivery_Operations/Edge-Cases.md) |
| Rider App | [HLD](../03-Modules/Rider_App/HLD.md) | [LLD](../03-Modules/Rider_App/LLD.md) | [API](../05-APIs/Rider_App.md) | [Mapping](../04-Database/Module-Mapping.md#rider-app) | [Cases](../03-Modules/Rider_App/Edge-Cases.md) |

Technical workflows: [WF-007](../06-Workflows/WF-007-Picking-Packing-and-Handoff.md) · [WF-008](../06-Workflows/WF-008-Rider-Assignment-and-POD.md) · [WF-009](../06-Workflows/WF-009-COD-Collection.md).

Feature references: `DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `DLV-05`, `RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-05`, `RID-06`, `RID-07`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
