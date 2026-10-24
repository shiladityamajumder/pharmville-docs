# Delivery Operations edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Delivery-and-Rider-App.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Delivery_Operations.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-DLV-01-01` | `DLV-01` | Rider telemetry stops | Last update/offline indicated; no fictitious live location | Dispatcher contacts rider and reviews assignment | `TC-DLV-01-DENY` |
| `EC-DLV-02-01` | `DLV-02` | Two dispatchers assign the same ready task | Single current assignment; stale write conflicts | Dispatcher refreshes and communicates accepted task | `TC-DLV-02-DENY` |
| `EC-DLV-03-01` | `DLV-03` | Resolution is submitted after reassignment | Stale resolution denied; parcel remains with current accountable task | Dispatch checks current assignment and reason | `TC-DLV-03-DENY` |
| `EC-DLV-04-01` | `DLV-04` | Handover is less than collection | Unresolved cash difference remains, no forced clear | Finance/Operations investigates evidence with rider | `TC-DLV-04-DENY` |
| `EC-DLV-05-01` | `DLV-05` | Off-duty or deactivated rider is assigned | Assignment refused without rewriting rider eligibility | Manager corrects approved shift/access | `TC-DLV-05-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
