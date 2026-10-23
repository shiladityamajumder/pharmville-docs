# Cart Checkout edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Cart & Checkout — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `CHK-01` | Cart saved across devices for logged-in customers | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-02` | Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-03` | Online payment via Cashfree: UPI, cards, net banking | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-04` | Cash on delivery, with a maximum order value and a block after repeated refusals | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-05` | Minimum order value and delivery fee applied from settings | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-06` | Price or stock change detected before payment; customer confirms | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-07` | No duplicate orders or charges (double tap, refresh, closed browser after payment) | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |
| `CHK-08` | Stock reserved during checkout, released automatically if payment does not finish | Payment timeout, duplicate intent or changed accepted quote | Pending/reconcile; one authoritative charge/refund; seek revised consent |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
