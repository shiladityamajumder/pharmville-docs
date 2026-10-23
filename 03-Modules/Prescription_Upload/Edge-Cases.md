# Prescription Upload edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Prescription Upload & Private Files — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `RX-01` | Upload one or more prescriptions (JPG, PNG, PDF) at checkout | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `RX-02` | Upload within 24 hours after ordering; auto-cancel after that | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `RX-03` | Reuse a saved, still-valid prescription | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `RX-04` | Link each prescription to the patient (self or family member) | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |
| `RX-05` | See the pharmacist's decision and reason; re-upload after rejection | Wrong patient, unclear Rx, rejected P line or changed prescription | Hold P only; require correction/review and customer acceptance |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
