# Prescription Management business flow

**Status: Proposed workflow; not implemented.** Accountable role: Prescription intake. Patient/prescription linkage; shared file infrastructure controls object storage and Pharmacist Review owns clinical decisions.

## Normal flow

1. Authorize customer, patient and exact order/revision linkage before creating a private JPG/PNG/PDF upload session.
2. Use shared file upload, completion and safety checks; incomplete or unsafe evidence cannot enter review.
3. Link only safe, permitted evidence to the owned patient/order; reuse never implies fresh clinical approval.
4. Expose the pharmacist outcome through a filtered projection and allow corrected evidence when the workflow permits.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `RX-01` | Must (draft) | [TC-RX-01-OK / adverse cases](LLD.md) |
| `RX-02` | Should (draft) | [TC-RX-02-OK / adverse cases](LLD.md) |
| `RX-03` | Should (draft) | [TC-RX-03-OK / adverse cases](LLD.md) |
| `RX-04` | Must (draft) | [TC-RX-04-OK / adverse cases](LLD.md) |
| `RX-05` | Must (draft) | [TC-RX-05-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Prescription-and-Pharmacy.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-004; D-006; D-010; D-024.
