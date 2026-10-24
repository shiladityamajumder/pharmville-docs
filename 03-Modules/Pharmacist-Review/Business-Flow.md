# Pharmacist Review business flow

**Status: Proposed workflow; not implemented.** Accountable role: Pharmacy clinical lead. Clinical review decisions and evidence; M/O-only orders do not enter mandatory pharmacist review.

## Normal flow

1. Load authorized P-line evidence for the current patient and accepted revision; verify reviewer eligibility and current location scope.
2. Match exact SKU, strength, form, quantity and patient; store per-line decision, reason and reviewer evidence atomically.
3. Reject stale competing decisions and retain rejected P lines on hold; never silently drop items or substitute products.
4. Request permitted correction or a revised basket; release only after all remaining P lines are approved and changed terms accepted.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `PHM-01` | Must (draft) | [TC-PHM-01-OK / adverse cases](LLD.md) |
| `PHM-02` | Must (draft) | [TC-PHM-02-OK / adverse cases](LLD.md) |
| `PHM-03` | Must (draft) | [TC-PHM-03-OK / adverse cases](LLD.md) |
| `PHM-04` | Should (draft) | [TC-PHM-04-OK / adverse cases](LLD.md) |
| `PHM-05` | Must (draft) | [TC-PHM-05-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Prescription-and-Pharmacy.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-004; D-006; D-009; D-024.
