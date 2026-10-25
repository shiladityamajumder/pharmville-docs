# ERD coverage report

## Measured coverage

| Measure | Result | Evidence status |
|---|---:|---|
| PostgreSQL schemas | 24 | Confirmed in checked-out catalog snapshot |
| Tables | 268 | Confirmed in checked-out catalog snapshot |
| Columns | 4,485 | Confirmed in checked-out catalog snapshot |
| Declared foreign keys | 1,476 | Parsed from catalog constraint definitions |
| Cross-schema foreign keys | 894 | Computed from FK child/parent schemas |
| Cross-schema schema pairs | 92 | Computed from FK inventory |
| Focused domain ER diagrams | 42 | Generated; 18 max entities per diagram |
| Tables represented as focus entities | 268 / 268 | Every table appears as a focus table once |
| Foreign keys represented by diagram IDs and catalog rows | 1476 / 1476 | Complete in snapshot scope |
| Tables with no declared FK | 1 | See [logical-reference review](Logical-References.md) |
| SQLAlchemy ORM `relationship()` declarations | 0 | Historical scan only; archived models are not schema authority |
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
| `identity` | 16 | 60 | 2 | 2 ([details](10-identity.md)) |
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

The generator verifies the standalone SQL, derived catalog/table register and logical-reference decision checksums against [Database-Evidence.json](../../09-References/Database-Evidence.json). All 268 table pages and 4,485 columns are validated against the effective catalog. Private PostgreSQL fresh-install parity is recorded separately; no production connection is used.

These ERDs cover every physical foreign key in the validated effective V0030 schema. SQL installation and zero catalog differences were verified in isolated disposable databases. Future proposals, business ownership approval and production deployment are separate states. The archived migration sources and nested Git history remain intact.

Potential review items are not declared defects: `platform.report_definitions` has no FK in the snapshot; polymorphic and opaque UUID references are explicitly classified and kept outside FK diagrams; and the 24 schema ownership boundaries remain candidate service ownership rather than access grants.
