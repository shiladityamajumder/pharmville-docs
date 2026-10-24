# Finance and reconciliation

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Reconciliation compares orders, payments, refunds, provider settlements and physical cash. Differences remain visible until explained, rather than changing a sale to force totals to match.

## Who is involved?

Finance staff/approvers, riders, cash receiving staff, Operations, support and provider/bank integration owners.

## How does it normally work?

1. Finance obtains trusted payment/refund and settlement evidence for the relevant period.
2. Pharmville compares references, amounts and currencies. Timing differences and unmatched records become investigation items.
3. COD checks compare amount due, actual rider collection and cash handed over/deposited per rider and period.
4. Staff investigate using order, payment, delivery and cash evidence. Corrections require reasons and the appropriate approval.
5. Journals, settlements, invoices and credit notes retain history. A repeated check must not post the same correction twice. Customers see only their own payment/refund outcome.

## What happens next?

Differences lead to a specific provider inquiry, refund, cash investigation or approved accounting correction. [Reporting and audit](Reporting-and-Audit.md) retain evidence.

## What can go wrong, and what does the system do?

### Settlement differs from the order

Fees, timing, missing items or wrong references may explain it. Finance sees an exception with original amounts, checks bank/provider evidence and records approved resolution. Pharmville does not fabricate payment to close it.

### The rider deposits less than collection

Counting errors or missing cash leave both actual amounts and an unresolved balance visible. Finance/Operations investigate with the rider. Delivery history remains intact and the shortage is not automatically cleared.

### A job or settlement file repeats

A restart/provider retry reuses existing evidence and must not duplicate settlement, credit or journal posting. Finance reviews conflicting replacements; the same run remains identifiable.

### Evidence or correction authority is missing

An outage leaves the period pending/unreconciled, while an unauthorized correction is denied. The integration owner retrieves evidence or a Finance approver reviews the adjustment. Money/history remain unchanged until the permitted action succeeds.

## What does the user see?

Finance sees matched items, original amounts and open differences by period/rider. Customers see their own money/refund status without internal or unrelated financial data.

## What still needs approval?

D-004 (provider results), D-007 (cash accountability), D-008/D-012 (accounting), D-016 (evidence). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Finance Payments | [HLD](../03-Modules/Finance_Payments/HLD.md) | [LLD](../03-Modules/Finance_Payments/LLD.md) | [API](../05-APIs/Finance_Payments.md) | [Mapping](../04-Database/Module-Mapping.md#finance-payments) | [Cases](../03-Modules/Finance_Payments/Edge-Cases.md) |

Technical workflows: [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) · [WF-009](../06-Workflows/WF-009-COD-Collection.md) · [WF-010](../06-Workflows/WF-010-Cancellation-Return-and-Refund.md) · [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md).

Feature references: `FIN-01`, `FIN-02`, `FIN-03`, `FIN-04`, `FIN-05`, `FIN-06`, `FIN-07`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
