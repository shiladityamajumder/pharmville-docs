# Customer Orders edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Customer Orders & Aftercare — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `ORD-01` | Order confirmation on screen, WhatsApp and email | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-02` | Status timeline (placed → packed → out for delivery → delivered) | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-03` | Order history with GST invoice download | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-04` | Cancel before the order is packed | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-05` | Return request within the return window | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-06` | Refund status for cancelled and returned orders | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-07` | Live rider location on a map, estimated arrival, masked call button | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-08` | Delivery OTP shown to the customer | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `ORD-09` | Change items or address after placing an order | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
