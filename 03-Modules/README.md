# 🧩 Module blueprint

These 18 canonical business modules retain all existing feature IDs and stable module identifiers. Each module directory now uses its stable module ID, giving every module one canonical folder without changing runtime boundaries. The architecture remains a proposed modular NestJS monolith with explicit domain commands, one PostgreSQL structure and asynchronous integration workers. Source contracts are **Proposed / Unapproved / Not Implemented**.

| Stable module ID | Blueprint | Proposed accountable role | Features | Surface APIs |
| --- | --- | --- | --- | --- |
| Authentication_Access | [Authentication](Authentication_Access/README.md) | Security / Identity | 4 | 5 |
| Customer_Accounts | [Customer Accounts](Customer_Accounts/README.md) | Customer platform | 7 | 19 |
| Product_Catalog | [Product Catalog](Product_Catalog/README.md) | Catalog / Merchandising | 6 | 8 |
| Cart_Checkout | [Cart Checkout](Cart_Checkout/README.md) | Commerce / Checkout | 8 | 4 |
| Prescription_Upload | [Prescription Management](Prescription_Upload/README.md) | Prescription intake | 5 | 3 |
| Pharmacist_Review | [Pharmacist Review](Pharmacist_Review/README.md) | Pharmacy clinical lead | 5 | 4 |
| Customer_Orders | [Customer Orders](Customer_Orders/README.md) | Customer commerce surface | 9 | 7 |
| Order_Operations | [Order Management](Order_Operations/README.md) | Order operations | 7 | 5 |
| Inventory | [Inventory](Inventory/README.md) | Inventory control | 7 | 6 |
| Store_Operations | [Store Operations](Store_Operations/README.md) | Store fulfillment | 5 | 6 |
| Warehouse | [Warehouse](Warehouse/README.md) | Warehouse / Procurement | 5 | 4 |
| Finance_Payments | [Payments](Finance_Payments/README.md) | Finance / Payments | 7 | 7 |
| Delivery_Operations | [Delivery](Delivery_Operations/README.md) | Delivery operations | 5 | 5 |
| Rider_App | [Rider Operations](Rider_App/README.md) | Rider operations / mobile client | 7 | 6 |
| Notifications | [Notifications](Notifications/README.md) | Communications / Platform | 5 | 4 |
| Admin_CMS | [Admin](Admin_CMS/README.md) | Administration / Operations | 9 | 7 |
| Reporting | [Reporting](Reporting/README.md) | Reporting / Finance analytics | 7 | 5 |
| Audit | [Audit](Audit/README.md) | Security / Audit platform | 2 | 2 |

## Ownership and navigation

Each module contains business flow, requirements, HLD, LLD, detailed API contracts, exact database mapping, workflows/security/test navigation, edge cases and dependencies/decisions. Shared rules remain linked centrally. Customer Orders and Rider Operations are client surfaces: Order Management, Delivery and Payments retain authoritative state. Public customer OTP routes retain their historical Customer Accounts surface while Authentication owns their execution.

[Module registry](Module-Registry.json) drives validators and diagram navigation. Each canonical module directory now matches its stable module ID, so every module has one folder and existing wireframe source links resolve directly to the canonical documents. Former central API pages remain thin compatibility targets; they are not separate modules or duplicate contract authorities. Historical folder moves are recorded in [module relocations](../09-References/Module-Relocations.json).

[System boundaries](../02-Architecture/Module-Boundaries.md) · [database ownership](../04-Database/Module-Mapping.md) · [API coverage](../05-APIs/API-Contract-Coverage.md) · [traceability](../09-References/Coverage-and-Traceability.md).
