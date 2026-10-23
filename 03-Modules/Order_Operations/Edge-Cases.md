# Order Operations edge cases

**Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Orders-and-Fulfillment.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Order_Operations.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-OMS-01-01` | `OMS-01` | Phone search is used outside location scope | No out-of-scope order disclosure | Operations uses authorized filter; Security checks scope | `TC-OMS-01-DENY` |
| `EC-OMS-02-01` | `OMS-02` | Supporting payment read fails | Missing evidence is explicit, not a fabricated paid summary | Finance checks payment; Operations waits on gate | `TC-OMS-02-DENY` |
| `EC-OMS-03-01` | `OMS-03` | Nearest site lacks approved stock/license | Ineligible site skipped; no silent split | Operations evaluates permitted alternative or customer revision | `TC-OMS-03-DENY` |
| `EC-OMS-04-01` | `OMS-04` | Two allocators reassign the same revision | Single assignment wins; no duplicate active site holds | Operations refreshes and reconciles handoff before picking | `TC-OMS-04-DENY` |
| `EC-OMS-05-01` | `OMS-05` | Staff removes a paid P line without customer acceptance | No silent changed basket or unauthorized financial reversal | Operations requests accepted revision; Finance handles compensation | `TC-OMS-05-DENY` |
| `EC-OMS-06-01` | `OMS-06` | Worker restart loses an in-memory alert | Durable current exception remains recoverable | Operations resumes from stored facts, not lost UI state | `TC-OMS-06-DENY` |
| `EC-OMS-07-01` | `OMS-07` | Staff guesses patient or payment approval for phone order | No fabricated consent, clinical approval or paid state | Product/Security approves assisted-order contract | `TC-OMS-07-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
