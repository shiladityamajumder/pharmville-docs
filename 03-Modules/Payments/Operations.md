# Payments operations and acceptance

## Workflow and state ownership

Money, refunds, invoices, accounting and reconciliation; no direct clinical or stock approval.

[WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-075 POST `/v1/payments/intents` | Yes | Customer; payments.initiate.own | Finance_Payments |
| API-076 POST `/v1/webhooks/cashfree` | Yes | Internal provider adapter; Valid provider signature + exact event/payment correlation | Finance_Payments |
| API-077 GET `/v1/admin/finance/payments` | Yes | Finance Officer; finance.payments.read | Finance_Payments |
| API-078 POST `/v1/admin/finance/refunds` | Yes | Authorized Finance Refund Officer; finance.refunds.instruct | Finance_Payments |
| API-079 GET `/v1/admin/finance/settlements` | Yes | Finance Reconciliation Officer; finance.settlements.read | Finance_Payments |
| API-080 POST `/v1/admin/finance/cod-reconciliation` | Yes | Finance Cash Reconciler; finance.cod.reconcile | Finance_Payments |
| API-081 GET `/v1/admin/finance/invoices/{order_id}` | Yes | Finance Officer; finance.invoices.read | Finance_Payments |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `FIN-01` | [TC-FIN-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `FIN-02` | [TC-FIN-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `FIN-03` | [TC-FIN-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `FIN-04` | [TC-FIN-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `FIN-05` | [TC-FIN-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `FIN-06` | [TC-FIN-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `FIN-07` | [TC-FIN-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
