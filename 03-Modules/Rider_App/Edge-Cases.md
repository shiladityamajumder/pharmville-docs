# Rider App edge cases

**Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Delivery-and-Rider-App.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Rider_App.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-RID-01-01` | `RID-01` | Old session tries to start a revoked rider’s shift | Protected shift denied; no availability activation | Security/Dispatch resolves status | `TC-RID-01-DENY` |
| `EC-RID-02-01` | `RID-02` | Other rider posts pickup | No custody change or task disclosure | Dispatch corrects assignment; authorized rider retries | `TC-RID-02-DENY` |
| `EC-RID-03-01` | `RID-03` | Offline device uploads delayed coordinates | Stale samples do not masquerade as live; access/retention policy applies | Dispatch uses last-known state; Privacy approves cadence/retention | `TC-RID-03-DENY` |
| `EC-RID-04-01` | `RID-04` | Wrong OTP or repeated offline completion | No completion on invalid proof; replay cannot duplicate collection | Rider retries approved proof or contacts Dispatch | `TC-RID-04-DENY` |
| `EC-RID-05-01` | `RID-05` | Rider is asked to approve a prescription at doorstep | No pharmacist decision fabricated by rider | Pharmacy/Operations approves door-check SOP before enabling | `TC-RID-05-DENY` |
| `EC-RID-06-01` | `RID-06` | Free-text unsupported failure reason is submitted | No false completed delivery or invented reason code | Rider selects approved reason; Dispatch decides next step | `TC-RID-06-DENY` |
| `EC-RID-07-01` | `RID-07` | Incentive configuration is missing or disputed | No invented earnings total or payout | Product/Finance approves incentive contract; rider sees pending availability | `TC-RID-07-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.

## Additional safety and recovery tests

Concrete interruption/race assertions supplement the feature table; detailed expected results are in the [LLD](LLD.md#critical-recovery-scenarios).

| Feature | Scenario | Test |
| --- | --- | --- |
| `RID-04` | Offline completion arrives after reassignment or OTP expiry | `TC-RID-04-01` |
| `RID-04` | Current rider submits incorrect delivery OTP with a valid-looking photo | `TC-RID-04-02` |
