# Pharmacist Review edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Prescription-and-Pharmacy.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Pharmacist_Review.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-PHM-01-01` | `PHM-01` | No authorized pharmacist is available | P remains waiting; no timeout auto-approval | Pharmacy Operations assigns a licensed authorized reviewer | `TC-PHM-01-DENY` |
| `EC-PHM-02-01` | `PHM-02` | Prescription link belongs to another patient | View/decision blocked and protected access audited | Customer corrects evidence; Pharmacy reviews scope | `TC-PHM-02-DENY` |
| `EC-PHM-03-01` | `PHM-03` | Two pharmacists decide the same old line | One current decision; stale command conflicts without overwriting history | Pharmacist reloads current review | `TC-PHM-03-DENY` |
| `EC-PHM-04-01` | `PHM-04` | Alternative changes after original approval | Old approval cannot authorize new SKU/quantity | Pharmacy reviews new evidence; customer accepts revision | `TC-PHM-04-DENY` |
| `EC-PHM-05-01` | `PHM-05` | Unprivileged staff posts an approval | No decision or approval bypass; denial is auditable | Security/Pharmacy corrects entitlement and preserves original history | `TC-PHM-05-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.

## Additional safety and recovery tests

Concrete interruption/race assertions supplement the feature table; detailed expected results are in the [LLD](LLD.md#critical-recovery-scenarios).

| Feature | Scenario | Test |
| --- | --- | --- |
| `PHM-03` | Customer accepts a changed SKU/quantity revision while pharmacist submits old decision | `TC-PHM-03-01` |
