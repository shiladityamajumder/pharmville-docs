# Store Operations edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Store-and-Warehouse.md) · [LLD and normal tests](LLD.md) · [API](APIs.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-STO-01-01` | `STO-01` | Alert fails while order is committed | Order remains in queue; alert retry creates no duplicate task | Store refreshes queue; Notifications repairs alert | `TC-STO-01-DENY` |
| `EC-STO-02-01` | `STO-02` | Wrong batch or stale P approval is scanned | Packing blocked; no stock commit or dispatch for mismatched evidence | Store reports discrepancy; Inventory/Pharmacy resolves | `TC-STO-02-DENY` |
| `EC-STO-03-01` | `STO-03` | Store submits the same replenishment after lost response | One request per intent, no duplicate dispatch demand | Store checks recorded request; Warehouse reviews it | `TC-STO-03-DENY` |
| `EC-STO-04-01` | `STO-04` | Receiver reports fewer packs than dispatched | Shortage remains recorded; missing stock not credited | Warehouse/Inventory investigates in-transit discrepancy | `TC-STO-04-DENY` |
| `EC-STO-05-01` | `STO-05` | Staff requests another store’s near-expiry report | No cross-location disclosure or adjustment authority | Manager reviews scope; Inventory owns stock records | `TC-STO-05-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.

## Additional safety and recovery tests

Concrete interruption/race assertions supplement the feature table; detailed expected results are in the [LLD](LLD.md#critical-recovery-scenarios).

| Feature | Scenario | Test |
| --- | --- | --- |
| `STO-02` | Exact held lot becomes expired/blocked before scan or pack closure | `TC-STO-02-01` |
