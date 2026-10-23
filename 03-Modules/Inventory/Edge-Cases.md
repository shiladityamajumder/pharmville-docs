# Inventory edge cases

**Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Inventory-and-Stock.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Inventory.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-INV-01-01` | `INV-01` | Same product has one expired and one eligible batch | Only eligible batch contributes to orderable quantity | Inventory/Pharmacy assesses blocked stock | `TC-INV-01-DENY` |
| `EC-INV-02-01` | `INV-02` | Movement reference is replayed | No second ledger effect or unexplained balance overwrite | Inventory reuses result and reconciles differences | `TC-INV-02-DENY` |
| `EC-INV-03-01` | `INV-03` | Earliest-expiry lot falls below approved shelf life | Lot skipped/blocked; never selected merely because oldest | Inventory chooses eligible lot; Pharmacy approves policy | `TC-INV-03-DENY` |
| `EC-INV-04-01` | `INV-04` | Large adjustment lacks required approval | No unauthorized ledger/balance mutation | Manager reviews evidence and approves/rejects | `TC-INV-04-DENY` |
| `EC-INV-05-01` | `INV-05` | Observation is stale when alert job runs | Staleness shown; alerts cannot authorize stock holds | Inventory restores feed and reevaluates thresholds | `TC-INV-05-DENY` |
| `EC-INV-06-01` | `INV-06` | Opening import is replayed after partial/lost acknowledgment | No double opening balance; explicit accepted/rejected rows | Inventory reconciles import identity and policy before retry | `TC-INV-06-DENY` |
| `EC-INV-07-01` | `INV-07` | Older or duplicate stock observation arrives | No stale observation replacing newer authority or duplicate movement | Integration owner replays ordered evidence and reconciles | `TC-INV-07-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.

## Additional safety and recovery tests

Concrete interruption/race assertions supplement the feature table; detailed expected results are in the [LLD](LLD.md#critical-recovery-scenarios).

| Feature | Scenario | Test |
| --- | --- | --- |
| `INV-01` | Two accepted orders concurrently request the last eligible pack at one site | `TC-INV-01-01` |
