# Notifications edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Notifications & Communications — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `NOT-01` | One notification service: templates, WhatsApp first, SMS fallback, email | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `NOT-02` | Delivery log with retries | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `NOT-03` | Rider push notifications (FCM) | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `NOT-04` | Staff alerts in the admin panel | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `NOT-05` | Customer browser push notifications | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
