# Pharmacist Review operations and acceptance

## Workflow and state ownership

Clinical review decisions and evidence; M/O-only orders do not enter mandatory pharmacist review.

[WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-060 GET `/v1/pharmacy/reviews` | Yes | Qualified Pharmacist; clinical.reviews.read | Pharmacist_Review |
| API-061 GET `/v1/pharmacy/reviews/{review_id}` | Yes | Qualified Pharmacist; clinical.reviews.read | Pharmacist_Review |
| API-062 POST `/v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` | Yes | Qualified assigned Pharmacist; clinical.reviews.decide | Pharmacist_Review |
| API-063 POST `/v1/me/orders/{order_id}/revisions/{revision_id}/accept` | Yes | Customer; orders.revision.accept.own | Order_Operations |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `PHM-01` | [TC-PHM-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `PHM-02` | [TC-PHM-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `PHM-03` | [TC-PHM-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `PHM-04` | [TC-PHM-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `PHM-05` | [TC-PHM-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
