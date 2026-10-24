# Cart Checkout edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Cart-and-Checkout.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Cart_Checkout.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-CHK-01-01` | `CHK-01` | Two devices edit the same old cart version | One edit wins; stale device reloads without overwriting accepted changes | Customer reconciles desired quantities | `TC-CHK-01-DENY` |
| `EC-CHK-02-01` | `CHK-02` | P basket selects an unauthorized patient | No accepted checkout/patient association | Customer selects permitted patient/address | `TC-CHK-02-DENY` |
| `EC-CHK-03-01` | `CHK-03` | Browser redirects to success without provider evidence | Payment remains unconfirmed; no dispatch authorization | Finance checks provider status under D-004/D-016 | `TC-CHK-03-DENY` |
| `EC-CHK-04-01` | `CHK-04` | COD policy is absent or order exceeds configured cap | COD is not approved; no collected-cash record | Customer chooses eligible payment; Finance approves policy | `TC-CHK-04-DENY` |
| `EC-CHK-05-01` | `CHK-05` | Basket falls below approved minimum after item removal | Summary requires correction/reacceptance; no stale total charged | Customer changes basket; Product approves configuration | `TC-CHK-05-DENY` |
| `EC-CHK-06-01` | `CHK-06` | Price changes after quote | Old version cannot authorize new amount or silent item removal | Customer accepts current revision or cancels | `TC-CHK-06-DENY` |
| `EC-CHK-07-01` | `CHK-07` | Double tap or timeout after checkout commit | One order per intent; different body with same key is a conflict | Customer reopens existing status; Finance checks unknown money | `TC-CHK-07-DENY` |
| `EC-CHK-08-01` | `CHK-08` | Expiry worker races with payment completion | One legal hold outcome; no duplicate release or restored committed stock | Inventory and Finance reconcile late success; duration awaits D-009 | `TC-CHK-08-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.

## Additional safety and recovery tests

Concrete interruption/race assertions supplement the feature table; detailed expected results are in the [LLD](LLD.md#critical-recovery-scenarios).

| Feature | Scenario | Test |
| --- | --- | --- |
| `CHK-03` | Provider captured payment; browser confirmation is lost | `TC-CHK-03-01` |
| `CHK-08` | Unused active reservation reaches its approved expires_at; expiry job runs twice | `TC-CHK-08-01` |
