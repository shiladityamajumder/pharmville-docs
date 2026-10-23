# Product Catalog HLD

## High-level design

## MOD-002: Product discovery and classification — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Product discovery and classification. Only approved and classified items can enter a legally permitted checkout path.

**System responsibility:** The `Product_Catalog` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Browse by category and sub-category (`CAT-01`)
- Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label (`CAT-02`)
- Search by name, brand and composition, with typo tolerance and autosuggest (`CAT-03`)
- Availability for the customer's pin code (in stock / out of stock) (`CAT-04`)
- Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule (`CAT-05`)
- Placeholder image when a product has none (`CAT-06`)

## Dependencies and trust boundaries
- Database candidates: `catalog.products`, `catalog.product_variants`, `catalog.product_classification_history`, `catalog.categories`, `search.documents`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Only approved and classified items can enter a legally permitted checkout path. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Feature context

## MOD-002 — Product discovery and classification

**Source classification:** 6 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Only approved and classified items can enter a legally permitted checkout path.

**Feature coverage**
- **CAT-01 / REQ-008:** Browse by category and sub-category (Must (draft)).
- **CAT-02 / REQ-009:** Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label (Must (draft)).
- **CAT-03 / REQ-010:** Search by name, brand and composition, with typo tolerance and autosuggest (Must (draft)).
- **CAT-04 / REQ-011:** Availability for the customer's pin code (in stock / out of stock) (Must (draft)).
- **CAT-05 / REQ-012:** Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule (Should (draft)).
- **CAT-06 / REQ-013:** Placeholder image when a product has none (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Product_Catalog.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
