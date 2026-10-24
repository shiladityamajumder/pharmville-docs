# Catalog and product discovery

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

The catalog helps customers find the exact product, pack and price offered by Pharmville. It distinguishes products needing a prescription from those that follow the ordinary shopping route.

## Who is involved?

Customers, catalog editors, pharmacists and inventory staff.

## How does it normally work?

1. The customer browses categories or searches by name, brand or composition. Suggestions help with spelling without choosing a medicine on their behalf.
2. The product page shows brand, manufacturer, composition, pack size, price, MRP and images. An approved placeholder appears when an image is missing.
3. Prescription medicines are clearly labelled. Existing documentation calls them P products; M means other medicines and O means other products. M/O do not require review merely because P is in the basket.
4. The customer enters a delivery location to see availability. Displayed availability is an indication, not stock already held for them.
5. If alternatives are offered, exact composition, strength and form are compared. A chosen alternative to a prescription medicine still needs the required pharmacist decision.

## What happens next?

Selected products enter [the cart](Cart-and-Checkout.md), where price, classification and stock are checked again.

## What can go wrong, and what does the system do?

### Search is empty or unavailable

A misspelling, unpublished item or search outage may explain it. Pharmville distinguishes no matches from service failure. The customer changes the query or browses published categories; catalog staff correct approved data. No substitute is automatically ordered.

### Classification is uncertain

Incomplete evidence may leave prescription requirements unknown. Pharmville blocks ordering the affected product and shows it unavailable pending review. Catalog and Pharmacy resolve classification; no payment is created for the blocked item.

### Stock or an alternative no longer matches

Another sale or an interrupted stock feed may invalidate availability; a similar name may hide a different strength. Pharmville rechecks stock and never silently substitutes medicine. The customer revises the basket, Operations fixes stock evidence, and Pharmacy reviews clinical suitability before progression.

## What does the user see?

Customers see exact packs, prices, prescription labels and location availability, with different messages for no matches and unavailable search. Alternatives remain explicit choices.

## What still needs approval?

D-005 (stock), D-006 (classification), D-010 (alternatives), D-019 (catalog sources). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Product Catalog | [HLD](../03-Modules/Product-Catalog/HLD.md) | [LLD](../03-Modules/Product-Catalog/LLD.md) | [API](../03-Modules/Product-Catalog/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#product-catalog) | [Cases](../03-Modules/Product-Catalog/Edge-Cases.md) |

Technical workflows: [WF-002](../06-Workflows/WF-002-Search-and-Availability.md).

Feature references: `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CAT-05`, `CAT-06`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
