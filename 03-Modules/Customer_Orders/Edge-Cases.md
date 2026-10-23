# Customer Orders edge cases

**Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Orders-and-Fulfillment.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Customer_Orders.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-ORD-01-01` | `ORD-01` | WhatsApp/email delivery fails after order commit | Order survives; failed message is tracked without another order | Notifications retries; customer uses existing status | `TC-ORD-01-DENY` |
| `EC-ORD-02-01` | `ORD-02` | Late event describes an earlier milestone | Timeline does not regress or imply delivery from packing | Order Operations rebuilds projection from authoritative facts | `TC-ORD-02-DENY` |
| `EC-ORD-03-01` | `ORD-03` | Another customer’s order ID is requested | No invoice URL or order existence leaked | Customer selects own order; Security reviews suspicious access | `TC-ORD-03-DENY` |
| `EC-ORD-04-01` | `ORD-04` | Pack-close and cancellation race | At most one valid transition; no newly packed cancelled order | Operations reloads state; support explains current eligibility | `TC-ORD-04-DENY` |
| `EC-ORD-05-01` | `ORD-05` | Item is outside approved return eligibility | Refusal reason; no refund or saleable-stock credit from request alone | Support reviews dispute under approved return policy | `TC-ORD-05-DENY` |
| `EC-ORD-06-01` | `ORD-06` | Provider refund is pending but UI refreshes | Pending remains visible; no false completed payout | Finance checks trusted result; customer waits on same reference | `TC-ORD-06-DENY` |
| `EC-ORD-07-01` | `ORD-07` | Location stream stops or access expires | Last update is identified; unauthorized access denied | Dispatch checks rider; customer refreshes permitted view | `TC-ORD-07-DENY` |
| `EC-ORD-08-01` | `ORD-08` | Unrelated user requests the code | No OTP disclosure or challenge change | Security investigates; customer uses authenticated order | `TC-ORD-08-DENY` |
| `EC-ORD-09-01` | `ORD-09` | New address is outside service area | Old accepted terms remain; no silent reroute or extra charge | Product approves edit contract; Operations reviews request | `TC-ORD-09-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
