# Notifications edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Notifications-and-Support.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Notifications.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-NOT-01-01` | `NOT-01` | Primary channel times out after uncertain delivery | One business event tracked; no uncontrolled fallback fan-out | Notification owner reconciles attempt under provider policy | `TC-NOT-01-DENY` |
| `EC-NOT-02-01` | `NOT-02` | Retry worker restarts after send acknowledgment is lost | No business action replay; uncertain message remains traceable | Notification owner checks provider-supported deduplication | `TC-NOT-02-DENY` |
| `EC-NOT-03-01` | `NOT-03` | Device token belongs to a previous rider session | No other rider’s task details sent | Rider re-registers permitted endpoint; Security checks ownership | `TC-NOT-03-DENY` |
| `EC-NOT-04-01` | `NOT-04` | Staff changes alert location ID | No cross-location or prescription detail leak | Manager reviews role; Notifications filters scope | `TC-NOT-04-DENY` |
| `EC-NOT-05-01` | `NOT-05` | Customer refuses browser permission | No forced subscription; order status remains available in app | Product approves optional push scope; customer can use ordinary status | `TC-NOT-05-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
