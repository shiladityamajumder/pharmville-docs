# Authentication Access edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Accounts-and-Login.md) · [LLD and normal tests](LLD.md) · [API](APIs.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-AUTH-01-01` | `AUTH-01` | Valid password with missing/invalid second factor | No privileged session | User retries approved proof; Security reviews recovery | `TC-AUTH-01-DENY` |
| `EC-AUTH-02-01` | `AUTH-02` | Refresh replays after session rotation or revocation | No unauthorized replacement session; security response per D-003 | Security applies approved replay response | `TC-AUTH-02-DENY` |
| `EC-AUTH-03-01` | `AUTH-03` | Parallel requests exceed configured shared limit | Rate-limited without account enumeration or bypass by race | Security reviews redacted abuse evidence | `TC-AUTH-03-DENY` |
| `EC-AUTH-04-01` | `AUTH-04` | Client supplies trusted actor/context of another user | Untrusted context ignored; no out-of-scope read/write | Security validates restricted runtime role and server-derived scope | `TC-AUTH-04-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
