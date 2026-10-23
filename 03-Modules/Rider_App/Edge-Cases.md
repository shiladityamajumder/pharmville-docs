# Rider App edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Rider Android App — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `RID-01` | OTP login; on duty, off duty and break | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `RID-02` | Task list; accept; open Google Maps to navigate; mark picked up | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `RID-03` | Background location: every 5–10 s on delivery, 15–30 s idle | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `RID-04` | Complete delivery with customer OTP and photo; record COD collected | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `RID-05` | Door checks for prescription medicines | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `RID-06` | Failed attempt with a reason from a fixed list | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `RID-07` | Daily deliveries and incentive earned | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
