# Authentication Access edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Authentication & Authorization — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `AUTH-01` | Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager | Expired OTP, replay, locked session or other account data | Rate-limit and deny; avoid account enumeration |
| `AUTH-02` | Lockout rules, session limits, one session per staff account | Expired OTP, replay, locked session or other account data | Rate-limit and deny; avoid account enumeration |
| `AUTH-03` | OTP rate limits per number and IP | Expired OTP, replay, locked session or other account data | Rate-limit and deny; avoid account enumeration |
| `AUTH-04` | Permissions checked on the server for every request | Expired OTP, replay, locked session or other account data | Rate-limit and deny; avoid account enumeration |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
