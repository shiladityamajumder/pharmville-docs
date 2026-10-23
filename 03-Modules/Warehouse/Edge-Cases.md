# Warehouse edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Warehouse & Store Replenishment — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `WH-01` | Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `WH-02` | Replenishment queue: approve, dispatch with note, stock "in transit" | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `WH-03` | Urgent runs, up to two extra a day | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `WH-04` | Pick, pack and dispatch fallback online orders | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `WH-05` | Basic stock audit | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
