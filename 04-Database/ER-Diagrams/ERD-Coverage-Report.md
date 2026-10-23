# ERD coverage report

## Measured coverage

| Measure | Result | Evidence status |
|---|---:|---|
| PostgreSQL schemas | 24 | Confirmed in checked-out catalog snapshot |
| Tables | 266 | Confirmed in checked-out catalog snapshot |
| Columns | 4,438 | Confirmed in checked-out catalog snapshot |
| Declared foreign keys | 1,461 | Parsed from catalog constraint definitions |
| Cross-schema foreign keys | 894 | Computed from FK child/parent schemas |
| Cross-schema schema pairs | 92 | Computed from FK inventory |
| Focused domain ER diagrams | 42 | Generated; 18 max entities per diagram |
| Tables represented as focus entities | 266 / 266 | Every table appears as a focus table once |
| Foreign keys represented by diagram IDs and catalog rows | 1461 / 1461 | Complete in snapshot scope |
| Tables with no declared FK | 1 | See [logical-reference review](Logical-References.md) |
| SQLAlchemy ORM `relationship()` declarations | 0 | None found in checked-in `app/models/` |
| Non-FK UUID references | 29 | Classified separately; see [Logical References](Logical-References.md) |

## Schema coverage

| Schema | Tables | FK rows | Cross-schema FK rows | ER diagrams |
|---|---:|---:|---:|---:|
| `appointment` | 9 | 49 | 31 | 2 ([details](01-appointment.md)) |
| `catalog` | 19 | 105 | 58 | 3 ([details](02-catalog.md)) |
| `clinical` | 17 | 111 | 63 | 3 ([details](03-clinical.md)) |
| `commerce` | 17 | 117 | 73 | 3 ([details](04-commerce.md)) |
| `compliance` | 8 | 43 | 37 | 1 ([details](05-compliance.md)) |
| `customer` | 8 | 38 | 32 | 1 ([details](06-customer.md)) |
| `diagnostics` | 13 | 79 | 43 | 2 ([details](07-diagnostics.md)) |
| `finance` | 8 | 45 | 31 | 1 ([details](08-finance.md)) |
| `fulfillment` | 10 | 70 | 46 | 2 ([details](09-fulfillment.md)) |
| `identity` | 14 | 45 | 2 | 2 ([details](10-identity.md)) |
| `insurance` | 8 | 42 | 28 | 1 ([details](11-insurance.md)) |
| `logistics` | 15 | 84 | 51 | 2 ([details](12-logistics.md)) |
| `marketplace` | 7 | 45 | 31 | 1 ([details](13-marketplace.md)) |
| `membership` | 6 | 24 | 14 | 1 ([details](14-membership.md)) |
| `notification` | 10 | 40 | 32 | 2 ([details](15-notification.md)) |
| `organization` | 6 | 39 | 21 | 1 ([details](16-organization.md)) |
| `payment` | 13 | 70 | 48 | 2 ([details](17-payment.md)) |
| `platform` | 21 | 66 | 44 | 3 ([details](18-platform.md)) |
| `pricing` | 8 | 41 | 29 | 1 ([details](19-pricing.md)) |
| `procurement` | 13 | 93 | 61 | 2 ([details](20-procurement.md)) |
| `risk` | 5 | 16 | 10 | 1 ([details](21-risk.md)) |
| `search` | 5 | 11 | 11 | 1 ([details](22-search.md)) |
| `support` | 8 | 44 | 28 | 1 ([details](23-support.md)) |
| `warehouse` | 18 | 144 | 70 | 3 ([details](24-warehouse.md)) |

## Relationship and diagram rules

- Each catalog row is one physical PostgreSQL FK constraint. Composite source and target columns stay in their declared order.
- Cardinality is derived from FK nullability and exact unique keys/indexes. A child FK is optional if any source column permits null; a child is unique per parent only when the complete FK column set is unique.
- Diagram labels use stable `FK-####` identifiers. Constraints between the same entity pair may share a labeled Mermaid edge only when their cardinality matches; each ID still resolves to a separate catalog row with exact columns and delete/update actions.
- Entities use safe Mermaid aliases `schema__table`. Every diagram has an alias-to-qualified-table mapping.
- The overall map is intentionally conceptual and includes only verified domains and representative declared schema links; [the cross-domain register](15-Cross-Domain-Relationships.md) and child-schema catalog pages provide complete FK detail.

## Evidence and limitations

The generator verifies all 103 migration/fragment SQL files, the final PostgreSQL catalog register and supporting source SHA-256 hashes against [Database-Evidence.json](../../09-References/Database-Evidence.json). The user-supplied folder has 30 versioned SQL migrations, V0001–V0030, and no standalone Git metadata. Its recorded acceptance report describes isolated PostgreSQL 18 validation on 22 October 2026. Read-only validation compares 266 table pages and 4,438 columns with the catalog snapshot; it does not connect to a live database.

These ERDs are **complete for the catalog in the user-supplied healthcare_db folder**, whose migration history ends at V0030. The earlier claim that V0030 was removed is superseded by this supplied source. Source selection is resolved for documentation; live deployment and fresh runtime parity remain separate checks. No migration, SQLAlchemy model, or database schema was modified. No new relationship is proposed as if it were factual.

Potential review items are not declared defects: `platform.report_definitions` has no FK in the snapshot; polymorphic and opaque UUID references are explicitly classified and kept outside FK diagrams; and the 24 schema ownership boundaries remain candidate service ownership rather than access grants.
