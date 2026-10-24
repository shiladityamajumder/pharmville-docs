# Reporting operations and acceptance

## Workflow and state ownership

Report definitions, runs and scoped read-only outputs; source domains own data and correction commands.

[WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-082 GET `/v1/admin/reports/sales` | Yes | Authorized Finance Report Viewer; reports.sales.read | Reporting |
| API-083 GET `/v1/admin/reports/tax` | Yes | Authorized Finance Report Viewer; reports.tax.read | Reporting |
| API-084 GET `/v1/admin/reports/stock` | Yes | Authorized Operational Report Viewer; reports.stock.read | Reporting |
| API-085 GET `/v1/admin/reports/deliveries` | Yes | Authorized Operational Report Viewer; reports.deliveries.read | Reporting |
| API-086 POST `/v1/admin/reports/exports` | Yes | Authorized Report Exporter; reports.export | Reporting |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `REP-01` | [TC-REP-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `REP-02` | [TC-REP-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `REP-03` | [TC-REP-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `REP-04` | [TC-REP-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `REP-05` | [TC-REP-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `REP-06` | [TC-REP-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `REP-07` | [TC-REP-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
