# Reporting edge cases

**Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Reporting-and-Audit.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Reporting.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-REP-01-01` | `REP-01` | Store filter requests unauthorized location | No out-of-scope totals or order detail | Reporting/Security reviews entitlement | `TC-REP-01-DENY` |
| `EC-REP-02-01` | `REP-02` | Underlying tax classification is unapproved | Report not described as filing-ready; unresolved data flagged | Finance/CA approves definitions and corrections | `TC-REP-02-DENY` |
| `EC-REP-03-01` | `REP-03` | Report is generated from stale observation | Data time/staleness visible; report not used as reservation authority | Inventory restores evidence; Reporting reruns | `TC-REP-03-DENY` |
| `EC-REP-04-01` | `REP-04` | Delivered parcel has unresolved COD shortage | Delivery is not counted as deposited cash | Finance resolves discrepancy; report preserves separate facts | `TC-REP-04-DENY` |
| `EC-REP-05-01` | `REP-05` | Pending refund is counted as completed payout | Pending and completed separated, no false financial closure | Finance/Reporting corrects definitions and reruns | `TC-REP-05-DENY` |
| `EC-REP-06-01` | `REP-06` | Dispatched transfer lacks destination acknowledgment | Not reported as fully received | Warehouse/Store investigates receipt | `TC-REP-06-DENY` |
| `EC-REP-07-01` | `REP-07` | User loses role while export runs | Download denied despite earlier job authorization | Security reviews access; Reporting expires/recreates authorized export | `TC-REP-07-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
