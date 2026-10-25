# Cart and checkout

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Checkout turns a basket into one understandable order request. The customer sees and accepts its contents, destination and total before payment proceeds.

## Who is involved?

Customers, Pharmacy, order operations, Inventory and Finance.

## How does it normally work?

1. A signed-in customer builds a cart that can be reopened on another device. Adding an item does not reserve stock.
2. The customer chooses a serviceable address. For P medicines they select themselves or an authorized dependent; the detailed draft uses one patient per such order.
3. Pharmville rechecks quantities, classification, prices, minimum value, delivery fee and estimate. The customer explicitly accepts a changed summary.
4. P baskets require prescription evidence and one recorded request for review. The current detailed journey completes pharmacist review and customer acceptance of any revision before payment. M/O-only baskets skip review.
5. Before payment, Pharmville checks eligible licensed-location and batch stock and obtains a temporary hold. A failed hold cannot be treated as confirmed supply.
6. The customer pays online or chooses eligible COD. Limits, refusal rules and hold duration require approval. The screen distinguishes awaiting review, checking payment and confirmed.

## What happens next?

Continue to [pharmacy](Prescription-and-Pharmacy.md), [payment](Payments-and-Billing.md) or [fulfillment](Orders-and-Fulfillment.md), according to the remaining gates.

## What can go wrong, and what does the system do?

### The customer taps twice or loses the response

A slow connection encourages repetition. Pharmville returns the same recorded outcome for that attempt and lets the customer reopen status. Support checks its reference; no second order or charge is created.

### The quote, address or payment choice is no longer valid

Another device, a price update or an unsupported destination can invalidate checkout. Pharmville explains what changed and pauses for a fresh accepted summary or eligible method. The customer corrects it; the old quote cannot authorize a new amount.

### A hold expires while money is uncertain

A delayed payment may outlast the approved hold. Inventory releases unused held stock once; Finance checks the existing payment. The customer sees checking payment and must not be asked to pay again immediately. Operations secures valid stock or Finance applies approved compensation; neither is assumed.

### Only some items remain available

Rejection or shortage can leave eligible lines. Pharmville offers a revision only under approved policy and waits for customer acceptance. It does not silently split sites, substitute or charge a changed basket.

## What does the user see?

Customers see the accepted summary and fee, changed-line warnings, review/payment next steps and the existing order reference. Duplicate clicks reopen that result.

## What still needs approval?

D-004 (payment sequence), D-005/D-009 (holds), D-007 (COD), D-010 (changes). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Cart Checkout | [HLD](../03-Modules/Cart_Checkout/HLD.md) | [LLD](../03-Modules/Cart_Checkout/LLD.md) | [API](../03-Modules/Cart_Checkout/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#cart-checkout) | [Cases](../03-Modules/Cart_Checkout/Edge-Cases.md) |

Technical workflows: [WF-003](../06-Workflows/WF-003-Cart-Quote-and-Reservation.md) · [WF-004](../06-Workflows/WF-004-Prescription-Intake-and-Review.md) · [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) · [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md).

Feature references: `CHK-01`, `CHK-02`, `CHK-03`, `CHK-04`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
