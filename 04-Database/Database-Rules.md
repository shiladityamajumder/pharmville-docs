# Database rules and ownership

## Table-domain ownership and shared access rules

Ownership is service-level responsibility for validating changes, not unrestricted ability to write every schema. The table below associates **schemas** with candidate active modules, using feature behavior. Several domains also contain future-phase data.

| Schema | Possible application module users | Ownership caveat |
| --- | --- | --- |
| `appointment` | Future/nonlaunch capability | Proposed — per-table read/write scope pending application design review |
| `catalog` | Product_Catalog, Inventory | Proposed — per-table read/write scope pending application design review |
| `clinical` | Customer_Accounts, Prescription_Upload, Pharmacist_Review | Proposed — per-table read/write scope pending application design review |
| `commerce` | Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting | Proposed — per-table read/write scope pending application design review |
| `compliance` | Pharmacist_Review, Audit | Proposed — per-table read/write scope pending application design review |
| `customer` | Customer_Accounts, Cart_Checkout, Prescription_Upload | Proposed — per-table read/write scope pending application design review |
| `diagnostics` | Future/nonlaunch capability | Proposed — per-table read/write scope pending application design review |
| `finance` | Customer_Orders, Finance_Payments, Reporting | Proposed — per-table read/write scope pending application design review |
| `fulfillment` | Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations | Proposed — per-table read/write scope pending application design review |
| `identity` | Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access | Proposed — per-table read/write scope pending application design review |
| `insurance` | Future/nonlaunch capability | Proposed — per-table read/write scope pending application design review |
| `logistics` | Customer_Orders, Delivery_Operations, Rider_App | Proposed — per-table read/write scope pending application design review |
| `marketplace` | Product_Catalog | Proposed — per-table read/write scope pending application design review |
| `membership` | Future/nonlaunch capability | Proposed — per-table read/write scope pending application design review |
| `notification` | Rider_App, Notifications | Proposed — per-table read/write scope pending application design review |
| `organization` | Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access | Proposed — per-table read/write scope pending application design review |
| `payment` | Finance_Payments | Proposed — per-table read/write scope pending application design review |
| `platform` | Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications | Proposed — per-table read/write scope pending application design review |
| `pricing` | Product_Catalog, Cart_Checkout | Proposed — per-table read/write scope pending application design review |
| `procurement` | Store_Operations, Warehouse | Proposed — per-table read/write scope pending application design review |
| `risk` | Audit | Proposed — per-table read/write scope pending application design review |
| `search` | Product_Catalog | Proposed — per-table read/write scope pending application design review |
| `support` | Future/nonlaunch capability | Proposed — per-table read/write scope pending application design review |
| `warehouse` | Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse | Proposed — per-table read/write scope pending application design review |

Before implementing a write, name a single command owner, one transaction boundary and which other modules may read it. Keep clinical/patient identity, finance/payment truth, stock reservations and audit evidence separate. Runtime capability groups are `NOLOGIN`; a trusted backend issues scoped and audited statements, not unreviewed broad table grants. File/report object access must be rechecked after signed URL creation.

See Module Dependency Matrix, Database Coverage and Security.

## Database security and protected records

The final SQL adds four restricted NOLOGIN capability groups, explicit customer-order and staff-warehouse RLS, protected-DML denials and V0029 default `PUBLIC EXECUTE` denial for future routines. These are tested capabilities only for the recorded coverage; they do not mean that every table automatically has RLS.

Trusted backend transactions must set audit actor context from server-verified authentication, never from a browser-controlled field. PostgreSQL migration-owner credentials must remain completely separate from runtime. Do not give analytics/export roles direct access to raw prescriptions, private files, credential hashes, clinical records or finance details not required by their purpose. Use scoped views and recheck file download authorization.

Encrypt at rest and in transit in deployed environments, apply S3 private object access, KMS key lifecycle, secrets rotation, export retention rules and detection of mass reads. Simulated integration/ACL test passes do not prove real provider or production cloud setup.

See Security Overview, Database Tests and Runtime Roles.

## Database reference — exact checked-in catalog snapshot

**Authoritative structure:** [standalone effective SQL](../pharmville-database/pharmville_schema.sql), validated on isolated PostgreSQL 18.6. Future populated-database releases require a separately approved procedure.

**Snapshot evidence:** local PG18 final inventory; not a production deployment.

- All 266 tables
- Stable DB IDs
- Every recorded foreign key
- SQL/catalog and documentation parity evidence
- 1,204 indexes
- 3,198 constraints
- 56 functions — exact DDL
- 879 triggers
- 3 RLS policies
- Empty-schema installation prerequisites and separate release-policy decisions
- Gap classification

Every schema has per-table field metadata and structural SQL contracts. Business meanings not backed by an approved PRD are explicitly inferred.
