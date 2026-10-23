# Delivery Operations edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Delivery Management — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `DLV-01` | Live map of riders (available, on delivery, offline) and orders ready for pickup | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `DLV-02` | Suggest the nearest available rider; staff confirm or choose another | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `DLV-03` | Failed-delivery queue: reattempt, reschedule or return to store | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `DLV-04` | COD handover: cash collected vs deposited per rider per day | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |
| `DLV-05` | Rider management: onboard, assign location, shifts | Offline GPS, invalid OTP, refused COD or no available rider | Record failed attempt and safe reschedule or human queue |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
