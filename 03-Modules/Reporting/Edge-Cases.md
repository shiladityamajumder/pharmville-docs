# Reporting edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Operational & Finance Reporting — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `REP-01` | Sales and orders, by date, store and product | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `REP-02` | GST report for filing | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `REP-03` | Stock, low stock and near-expiry | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `REP-04` | COD, rider collections and deliveries per rider | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `REP-05` | Refunds, cancellations and failed deliveries | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `REP-06` | Replenishment transfers | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |
| `REP-07` | Excel export for every report | Malformed payload, stale record or missing dependency | Reject unsafe transition, show actionable message; keep authoritative state unchanged |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
