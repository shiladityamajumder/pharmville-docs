# Product Catalog operations and acceptance

## Workflow and state ownership

Catalog/classification and discovery; tax meaning remains Finance-owned and search is derived.

[WF-002](../../06-Workflows/WF-002-Search-and-Availability.md), [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-010 GET `/v1/catalog/categories` | No; endpoint-specific pre-login/provider trust | Public; Published catalog read | Product_Catalog |
| API-011 GET `/v1/catalog/products` | No; endpoint-specific pre-login/provider trust | Public; Published catalog read | Product_Catalog |
| API-012 GET `/v1/catalog/products/{product_id}` | No; endpoint-specific pre-login/provider trust | Public; Published catalog read | Product_Catalog |
| API-013 GET `/v1/catalog/search` | No; endpoint-specific pre-login/provider trust | Public; Published catalog search | Product_Catalog |
| API-014 GET `/v1/catalog/availability` | No; endpoint-specific pre-login/provider trust | Public; Advisory catalog availability | Product_Catalog |
| API-015 POST `/v1/admin/catalog/imports` | Yes | Catalog Manager; catalog.import | Product_Catalog |
| API-016 POST `/v1/admin/catalog/products/{product_id}/classification` | Yes | Catalog Manager with Pharmacy classification approval; catalog.classification.approve | Product_Catalog |
| API-017 POST `/v1/admin/catalog/products/{product_id}/publish` | Yes | Catalog Manager; catalog.publish | Product_Catalog |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `CAT-01` | [TC-CAT-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CAT-02` | [TC-CAT-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CAT-03` | [TC-CAT-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CAT-04` | [TC-CAT-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CAT-05` | [TC-CAT-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CAT-06` | [TC-CAT-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
