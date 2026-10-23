# The customer experience

## What is this process?

This page follows the choices a customer makes from finding an item to resolving a problem after delivery. The [complete business flow](Pharmville-Complete-Business-Flow.md) explains the work behind those choices.

## Who is involved?

The customer or authorized family-account holder, Pharmacy, fulfillment staff, the rider and support. Each staff team sees only the information its work requires.

## How does it normally work?

1. Browse and compare exact products, packs, prices and prescription labels in [discovery](Catalog-and-Product-Discovery.md).
2. Sign in, complete required profile information and choose a saved or new address through [accounts](Accounts-and-Login.md).
3. Review the basket, delivery result, fee and estimate. If prescription medicines remain, select the correct patient and provide evidence. See [checkout](Cart-and-Checkout.md).
4. For P medicines, wait for the pharmacist’s decision. Correct an unclear file or explicitly accept a permitted changed basket. M/O-only baskets skip this branch. See [pharmacy](Prescription-and-Pharmacy.md).
5. After eligible stock is held, pay online or choose eligible COD. Reopen the existing status if the connection drops. See [payments](Payments-and-Billing.md).
6. Follow actual preparation and delivery milestones. Use permitted tracking/masked calling and provide the correct doorstep OTP. See [delivery](Delivery-and-Rider-App.md).
7. Open history for invoices, cancellation eligibility, return requests and refund progress. Keep the order/reference for support rather than starting another purchase to fix an uncertain result.

## What happens next?

Delivery completes the purchase journey, while finance may still be checking settlement. A cancellation, return or refund follows [its own eligibility and progress](Returns-and-Refunds.md).

## What can go wrong, and what does the system do?

- **A field or file is wrong:** the customer sees what needs correction, with no unauthorized patient association or assumed approval. The customer corrects it; a pharmacist reviews clinical evidence.
- **Price or supply changes:** the customer receives a refreshed basket and accepts any permitted change. Operations handles shortages; no different medicine or amount is silently accepted.
- **The bank charges but the screen is pending:** the customer stays on the existing reference and waits for the trusted payment check. Finance investigates; another immediate charge is not the recovery action.
- **Preparation or delivery stalls:** Pharmacy, Operations or dispatch owns the displayed waiting step. Support explains the current record and available choices without promising an unapproved deadline.
- **Return or refund is refused/delayed:** the customer sees the reason or pending reference and can contact support. Finance/Operations resolve it; neither a request nor a support message counts as completed payout.

## What does the user see?

Clear product labels, an accepted summary, review/payment statuses, evidenced milestones and eligible actions. Waiting, failed and completed outcomes must be distinguishable. Exact interface design is future application work; these are business expectations, not implemented screens.

## What still needs approval?

Payment and deferred-upload order (D-004), clinical rules (D-006), stock/partial fulfillment (D-005/D-009/D-010), rider privacy/proof (D-011), returns/refunds and support commitments (D-004/D-020). See [owners and blocked actions](../09-References/Sources-and-Decisions.md).

## Related technical documentation

[Journey stages](../01-Project/User-Journeys.md) · [HLD](../02-Architecture/System-HLD.md) · [customer LLD](../03-Modules/Customer_Orders/LLD.md) · [customer APIs](../05-APIs/Customer_Orders.md) · [data](../04-Database/Module-Mapping.md#customer-orders) · [workflows](../06-Workflows/README.md) · [edge cases/tests and feature IDs](../09-References/Coverage-and-Traceability.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)
