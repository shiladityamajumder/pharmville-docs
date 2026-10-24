# Relationship catalog

## Scope and evidence

The validated standalone SQL catalog contains **1461 declared foreign-key constraints**. The catalog keeps every physical constraint as its own row, including the paired public UUID and internal BIGINT relationships. It records source columns, referenced columns, nullability, uniqueness-based cardinality, delete/update actions, and the owning schema diagram.

The records are derived from the validated standalone-schema catalog, checked against [Database-Evidence.json](../../09-References/Database-Evidence.json). The [installation and provenance reference](../Migrations.md) distinguishes executed isolated parity from production deployment.

## Browse by child schema

| Child schema | Tables | FK rows | Catalog |
|---|---:|---:|---|
| `appointment` | 9 | 49 | [appointment foreign keys](Relationship-Catalog/appointment.md) |
| `catalog` | 19 | 105 | [catalog foreign keys](Relationship-Catalog/catalog.md) |
| `clinical` | 17 | 111 | [clinical foreign keys](Relationship-Catalog/clinical.md) |
| `commerce` | 17 | 117 | [commerce foreign keys](Relationship-Catalog/commerce.md) |
| `compliance` | 8 | 43 | [compliance foreign keys](Relationship-Catalog/compliance.md) |
| `customer` | 8 | 38 | [customer foreign keys](Relationship-Catalog/customer.md) |
| `diagnostics` | 13 | 79 | [diagnostics foreign keys](Relationship-Catalog/diagnostics.md) |
| `finance` | 8 | 45 | [finance foreign keys](Relationship-Catalog/finance.md) |
| `fulfillment` | 10 | 70 | [fulfillment foreign keys](Relationship-Catalog/fulfillment.md) |
| `identity` | 14 | 45 | [identity foreign keys](Relationship-Catalog/identity.md) |
| `insurance` | 8 | 42 | [insurance foreign keys](Relationship-Catalog/insurance.md) |
| `logistics` | 15 | 84 | [logistics foreign keys](Relationship-Catalog/logistics.md) |
| `marketplace` | 7 | 45 | [marketplace foreign keys](Relationship-Catalog/marketplace.md) |
| `membership` | 6 | 24 | [membership foreign keys](Relationship-Catalog/membership.md) |
| `notification` | 10 | 40 | [notification foreign keys](Relationship-Catalog/notification.md) |
| `organization` | 6 | 39 | [organization foreign keys](Relationship-Catalog/organization.md) |
| `payment` | 13 | 70 | [payment foreign keys](Relationship-Catalog/payment.md) |
| `platform` | 21 | 66 | [platform foreign keys](Relationship-Catalog/platform.md) |
| `pricing` | 8 | 41 | [pricing foreign keys](Relationship-Catalog/pricing.md) |
| `procurement` | 13 | 93 | [procurement foreign keys](Relationship-Catalog/procurement.md) |
| `risk` | 5 | 16 | [risk foreign keys](Relationship-Catalog/risk.md) |
| `search` | 5 | 11 | [search foreign keys](Relationship-Catalog/search.md) |
| `support` | 8 | 44 | [support foreign keys](Relationship-Catalog/support.md) |
| `warehouse` | 18 | 144 | [warehouse foreign keys](Relationship-Catalog/warehouse.md) |

The [cross-domain register](15-Cross-Domain-Relationships.md) summarizes all cross-schema FK pairs. The [ERD inventory](ERD-Inventory.json) is a machine-readable snapshot used by the validator. Logical UUIDs and polymorphic references that are not enforced as foreign keys are separately listed in [Logical References](Logical-References.md).
