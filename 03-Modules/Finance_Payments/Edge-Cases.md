# Finance Payments edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Payments, Invoices & Refunds — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `FIN-01` | Payment records from Cashfree webhooks and COD collections | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `FIN-02` | GST invoice per order, from the right GSTIN | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `FIN-03` | Automatic refunds; manual refunds need approval above a set amount | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `FIN-04` | COD refunds by bank transfer or UPI | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `FIN-05` | Daily reconciliation: Cashfree settlements vs orders | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `FIN-06` | COD reconciliation: collected vs deposited | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `FIN-07` | Credit notes for refunds and returns | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
