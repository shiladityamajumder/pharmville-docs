# Payments and billing

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Payments records whether money is paid, uncertain or owed on delivery. Billing records the accepted sale and its tax evidence; a return screen alone proves neither.

## Who is involved?

Customers, the payment provider, Finance, Operations, riders collecting COD and accounting reviewers.

## How does it normally work?

1. The customer accepts the total and eligible payment method. Cashfree, with UPI/cards/net banking, is the draft online provider; its exact integration still needs evidence.
2. The current detailed journey completes required prescription review and a valid stock hold before payment. Capture timing and deferred upload remain owner decisions.
3. Pharmville verifies the provider result before marking paid. A browser redirect cannot authorize the money record.
4. COD records an approved amount due. Collection, rider cash handover and deposit are later separate facts.
5. Confirmed money or approved COD permits progression only while clinical, stock and fulfillment gates also pass. The customer downloads an issued invoice from order history; GSTIN, tax and credit-note rules need Finance approval.

## What happens next?

Eligible orders enter [fulfillment](Orders-and-Fulfillment.md). Money is checked through [reconciliation](Finance-and-Reconciliation.md).

## What can go wrong, and what does the system do?

### Payment succeeds but confirmation is lost

The bank may charge before the connection drops. The app shows checking payment and does not immediately request another payment. Finance checks trusted provider evidence against the existing order. Operations rechecks stock and follows approved recovery; payment and order stay pending until evidence resolves them.

### The bank declines or the provider times out

A decline may be final; a timeout may be unknown. Pharmville shows the supported failed/pending result and keeps the attempt identifiable. Unused holds follow approved expiry; the customer retries only after uncertainty resolves. Finance investigates prolonged unknowns.

### A result repeats or arrives after stock release

Provider retries and delays happen. Money is recorded once and an older failure cannot undo trusted success. A late payment does not recreate stock: Operations checks supply and Finance follows approved compensation. The customer sees investigation until a real outcome is recorded.

### An invoice cannot be issued correctly

Missing tax setup or a service interruption leaves invoice pending. Finance corrects the evidence and issues once; the customer is not charged again to fix a document.

## What does the user see?

Customers see amount/method, checking payment, confirmed/failed money and invoice pending/issued. Finance sees provider evidence and exceptions, separately from order preparation.

## What still needs approval?

D-004 (capture/late success), D-007 (COD), D-008/D-012 (accounting/tax), D-016 (provider contract). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Finance Payments | [HLD](../03-Modules/Finance_Payments/HLD.md) | [LLD](../03-Modules/Finance_Payments/LLD.md) | [API](../05-APIs/Finance_Payments.md) | [Mapping](../04-Database/Module-Mapping.md#finance-payments) | [Cases](../03-Modules/Finance_Payments/Edge-Cases.md) |
| Cart Checkout | [HLD](../03-Modules/Cart_Checkout/HLD.md) | [LLD](../03-Modules/Cart_Checkout/LLD.md) | [API](../05-APIs/Cart_Checkout.md) | [Mapping](../04-Database/Module-Mapping.md#cart-checkout) | [Cases](../03-Modules/Cart_Checkout/Edge-Cases.md) |

Technical workflows: [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) · [WF-009](../06-Workflows/WF-009-COD-Collection.md) · [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md).

Feature references: `CHK-03`, `CHK-04`, `CHK-07`, `FIN-01`, `FIN-02`, `FIN-03`, `FIN-04`, `FIN-07`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
