# Finance Payments edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Finance-and-Reconciliation.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Finance_Payments.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-FIN-01-01` | `FIN-01` | Unsigned, repeated or out-of-order webhook arrives | Unsigned rejected; replay has no second effect; older failure cannot undo success | Finance reconciles trusted provider evidence | `TC-FIN-01-DENY` |
| `EC-FIN-02-01` | `FIN-02` | GSTIN/tax setup is missing | Invoice pending/blocked; no invented tax document or recharge | Finance/CA corrects approved tax setup | `TC-FIN-02-DENY` |
| `EC-FIN-03-01` | `FIN-03` | Duplicate refund races with another refund | Cumulative payout cannot exceed permitted paid value; one instruction per intent | Finance reloads refunded totals and reconciles unknown provider result | `TC-FIN-03-DENY` |
| `EC-FIN-04-01` | `FIN-04` | Unverified replacement destination is supplied | No money sent; refund awaits verified details | Finance obtains approved proof securely | `TC-FIN-04-DENY` |
| `EC-FIN-05-01` | `FIN-05` | Provider amount/currency/reference differs from order | Unresolved reconciliation item, no fabricated settlement | Finance investigates provider/bank and posts approved correction | `TC-FIN-05-DENY` |
| `EC-FIN-06-01` | `FIN-06` | Rider deposit is short | Cash exception remains open; delivery not rewritten | Finance/Operations investigates shortage | `TC-FIN-06-DENY` |
| `EC-FIN-07-01` | `FIN-07` | Same credit note intent repeats | No duplicate credit or journal effect; original invoice retained | Finance checks existing credit reference and policy | `TC-FIN-07-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.

## Additional safety and recovery tests

Concrete interruption/race assertions supplement the feature table; detailed expected results are in the [LLD](LLD.md#critical-recovery-scenarios).

| Feature | Scenario | Test |
| --- | --- | --- |
| `FIN-03` | Concurrent distinct refunds each request the same remaining refundable amount | `TC-FIN-03-01` |
| `FIN-05` | Provider settlement evidence for the period is missing | `TC-FIN-05-01` |
