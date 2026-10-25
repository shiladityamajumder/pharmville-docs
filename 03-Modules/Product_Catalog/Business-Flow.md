# Product Catalog business flow

**Status: Proposed workflow; not implemented.** Accountable role: Catalog / Merchandising. Catalog/classification and discovery; tax meaning remains Finance-owned and search is derived.

## Normal flow

1. Publish authorized catalog data with confirmed P/M/O classification, SKU/variant and active master dependencies.
2. Search and browse safely paginated public projections; combine price and location-specific availability without promising a hold.
3. Show current product details and permitted alternatives; unknown classification blocks checkout.
4. Pass the exact selected variant and quantity into cart; any later price or substitution change needs fresh customer acceptance.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `CAT-01` | Must (draft) | [TC-CAT-01-OK / adverse cases](LLD.md) |
| `CAT-02` | Must (draft) | [TC-CAT-02-OK / adverse cases](LLD.md) |
| `CAT-03` | Must (draft) | [TC-CAT-03-OK / adverse cases](LLD.md) |
| `CAT-04` | Must (draft) | [TC-CAT-04-OK / adverse cases](LLD.md) |
| `CAT-05` | Should (draft) | [TC-CAT-05-OK / adverse cases](LLD.md) |
| `CAT-06` | Must (draft) | [TC-CAT-06-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-002](../../06-Workflows/WF-002-Search-and-Availability.md), [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Catalog-and-Product-Discovery.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-007; D-012; D-019; D-024.
