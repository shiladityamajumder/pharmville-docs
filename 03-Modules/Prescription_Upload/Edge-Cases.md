# Prescription Upload edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Prescription-and-Pharmacy.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Prescription_Upload.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-RX-01-01` | `RX-01` | Upload is interrupted or malware check fails | File cannot become usable prescription evidence | Customer retries/replaces upload; file owner investigates | `TC-RX-01-DENY` |
| `EC-RX-02-01` | `RX-02` | Deadline job runs with no approved policy | No invented 24-hour cancellation or refund behavior | Product, Pharmacy and Finance settle conflicting journey before enabling | `TC-RX-02-DENY` |
| `EC-RX-03-01` | `RX-03` | Previously saved prescription is no longer valid | Reuse denied; no inherited approval for changed evidence | Customer uploads valid evidence; Pharmacy reviews | `TC-RX-03-DENY` |
| `EC-RX-04-01` | `RX-04` | Wrong patient prescription ID is submitted | No wrong-patient linkage; safe denial | Customer corrects evidence; Pharmacy checks match | `TC-RX-04-DENY` |
| `EC-RX-05-01` | `RX-05` | Rejected file is resubmitted as if still approved | Earlier decision retained; new evidence requires current decision | Customer corrects file; authorized pharmacist reviews again | `TC-RX-05-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
