# 🧩 Module blueprint

These 18 canonical business modules retain all existing feature IDs and stable module identifiers. Descriptive directory names are navigation, not approved changes to runtime boundaries. The architecture remains a proposed modular NestJS monolith with explicit domain commands, one PostgreSQL structure and asynchronous integration workers. Source contracts are **Proposed / Unapproved / Not Implemented**.

| Stable module ID | Blueprint | Proposed accountable role | Features | Surface APIs |
| --- | --- | --- | --- | --- |
| Authentication_Access | [Authentication](Authentication/README.md) | Security / Identity | 4 | 5 |
| Customer_Accounts | [Customer Accounts](Customer-Accounts/README.md) | Customer platform | 7 | 19 |
| Product_Catalog | [Product Catalog](Product-Catalog/README.md) | Catalog / Merchandising | 6 | 8 |
| Cart_Checkout | [Cart Checkout](Cart-Checkout/README.md) | Commerce / Checkout | 8 | 4 |
| Prescription_Upload | [Prescription Management](Prescription-Management/README.md) | Prescription intake | 5 | 3 |
| Pharmacist_Review | [Pharmacist Review](Pharmacist-Review/README.md) | Pharmacy clinical lead | 5 | 4 |
| Customer_Orders | [Customer Orders](Customer-Orders/README.md) | Customer commerce surface | 9 | 7 |
| Order_Operations | [Order Management](Order-Management/README.md) | Order operations | 7 | 5 |
| Inventory | [Inventory](Inventory/README.md) | Inventory control | 7 | 6 |
| Store_Operations | [Store Operations](Store-Operations/README.md) | Store fulfillment | 5 | 6 |
| Warehouse | [Warehouse](Warehouse/README.md) | Warehouse / Procurement | 5 | 4 |
| Finance_Payments | [Payments](Payments/README.md) | Finance / Payments | 7 | 7 |
| Delivery_Operations | [Delivery](Delivery/README.md) | Delivery operations | 5 | 5 |
| Rider_App | [Rider Operations](Rider-Operations/README.md) | Rider operations / mobile client | 7 | 6 |
| Notifications | [Notifications](Notifications/README.md) | Communications / Platform | 5 | 4 |
| Admin_CMS | [Admin](Admin/README.md) | Administration / Operations | 9 | 7 |
| Reporting | [Reporting](Reporting/README.md) | Reporting / Finance analytics | 7 | 5 |
| Audit | [Audit](Audit/README.md) | Security / Audit platform | 2 | 2 |

## Ownership and navigation

Each module contains business flow, requirements, HLD, LLD, detailed API contracts, exact database mapping, workflows/security/test navigation, edge cases and dependencies/decisions. Shared rules remain linked centrally. Customer Orders and Rider Operations are client surfaces: Order Management, Delivery and Payments retain authoritative state. Public customer OTP routes retain their historical Customer Accounts surface while Authentication owns their execution.

[Module registry](Module-Registry.json) drives validators and diagram navigation. Original underscore paths and former central API pages remain thin compatibility targets, including their old anchors, so the protected wireframes work without edits. They are not separate modules or duplicate contract authorities.

[System boundaries](../02-Architecture/Module-Boundaries.md) · [database ownership](../04-Database/Module-Mapping.md) · [API coverage](../05-APIs/API-Contract-Coverage.md) · [traceability](../09-References/Coverage-and-Traceability.md).
