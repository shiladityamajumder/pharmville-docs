# Prescription Management operations and acceptance

## Workflow and state ownership

Patient/prescription linkage; shared file infrastructure controls object storage and Pharmacist Review owns clinical decisions.

[WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-022 POST `/v1/prescriptions/upload-intents` | Yes | Customer; prescription-upload.manage.own | Prescription_Upload via platform file service |
| API-023 POST `/v1/prescriptions/documents/confirm` | Yes | Customer; prescription-upload.manage.own | Prescription_Upload |
| API-024 POST `/v1/orders/{order_id}/prescriptions` | Yes | Customer; prescription-upload.manage.own | Prescription_Upload |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `RX-01` | [TC-RX-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RX-02` | [TC-RX-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RX-03` | [TC-RX-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RX-04` | [TC-RX-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RX-05` | [TC-RX-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
