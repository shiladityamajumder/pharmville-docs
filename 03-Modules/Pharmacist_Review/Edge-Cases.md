# Pharmacist Review edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Pharmacist Verification — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `PHM-01` | Review queue, oldest first, with waiting time | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `PHM-02` | Side-by-side view: zoomable prescription and order items | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `PHM-03` | Approve all, approve some, or reject with a reason | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `PHM-04` | Confirm a chosen alternative matches the prescription | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `PHM-05` | Pharmacist name, registration number and time on every decision | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
