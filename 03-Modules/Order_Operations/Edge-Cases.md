# Order Operations edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Order Management & Routing — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `OMS-01` | Order list with filters (status, location, date, payment, Rx) and search by order number or phone | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `OMS-02` | Order detail: items, batches, prescription, payment, delivery, full history | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `OMS-03` | Automatic routing to the nearest open store with every item; warehouse as fallback | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `OMS-04` | Reassign an order to another location, with a reason | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `OMS-05` | Cancel, partly fulfil, raise return, add internal note | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `OMS-06` | Attention queue: payment pending, stuck orders, failed deliveries | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `OMS-07` | Assisted order entry for phone orders | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
