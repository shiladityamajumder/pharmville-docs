# Audit edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Reporting-and-Audit.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Audit.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-AUD-01-01` | `AUD-01` | Audit persistence fails during privileged mutation | No unaudited privileged success; transaction rolls back where coupled | Security/platform restores durable audit path | `TC-AUD-01-DENY` |
| `EC-AUD-02-01` | `AUD-02` | User attempts update/delete or unscoped export | History unchanged; access denied and investigated | Security/auditor records new correction event if needed | `TC-AUD-02-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
