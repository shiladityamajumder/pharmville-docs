# Store Operations edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Store Picking & Replenishment — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `STO-01` | Incoming order queue for my store, with sound alert | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `STO-02` | Accept order, pick list, mark packed, hand over to rider | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `STO-03` | Raise replenishment request (normal or urgent) | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `STO-04` | Confirm receipt of a transfer; record shortages | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `STO-05` | My store's stock, with low-stock and near-expiry alerts | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
