# Inventory edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Inventory & Stock Reservations — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `INV-01` | Stock per location and batch, with manufacturing and expiry dates | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `INV-02` | Stock ledger: every movement recorded; stock is the sum of the ledger | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `INV-03` | Allocate nearest-expiry batch first; block batches below minimum shelf life | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `INV-04` | Stock adjustments with reason; manager approval above a threshold | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `INV-05` | Low-stock and near-expiry alerts | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `INV-06` | Opening stock import per location | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |
| `INV-07` | Stock sync with Techsmith | Stale stock, expired lot, conflicting allocation or wrong location | Block reservation/pick; reconcile observation and preserve ledger |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
