# Warehouse edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Store-and-Warehouse.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Warehouse.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-WH-01-01` | `WH-01` | Missing expiry or failed quality check | Unusable receipt cannot become orderable stock | Receiving/Pharmacy reviews; supplier discrepancy retained | `TC-WH-01-DENY` |
| `EC-WH-02-01` | `WH-02` | Dispatch repeats before destination receipt | One dispatch; destination gets no saleable credit until receipt | Warehouse/Store reconciles transfer quantities | `TC-WH-02-DENY` |
| `EC-WH-03-01` | `WH-03` | A third extra run is requested under draft two-run wording | No invented operational approval; explicit scheduling exception | Operations approves capacity/limit under D-002 | `TC-WH-03-DENY` |
| `EC-WH-04-01` | `WH-04` | Warehouse has stock but lacks approved dispensing license | No fallback pick/dispatch authorization | Operations selects eligible site or resolves with Pharmacy | `TC-WH-04-DENY` |
| `EC-WH-05-01` | `WH-05` | Count disagrees with ledger | No silent stock correction or erased movement history | Inventory manager reviews adjustment evidence | `TC-WH-05-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
