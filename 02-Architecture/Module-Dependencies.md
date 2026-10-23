# Module dependencies

## Planning dependency graph

```mermaid
flowchart LR
 DB[SQL migrations + role policies] --> AUTH[Identity/auth]
 DB --> CAT[Catalog / approved classification]
 AUTH --> CUST[Customer profiles + patient]
 CAT --> CART[Cart / quote]
 CUST --> CART
 CART --> RX[Conditional Rx review]
 CART --> STOCK[POS / license / inventory hold]
 RX --> STOCK
 STOCK --> PAY[Payment and COD truth]
 PAY --> PICK[Store/warehouse picking]
 PICK --> RIDER[Rider dispatch + OTP]
 RIDER --> REC[Reconciliation / audit / reporting]
```

The graph represents prerequisite domain evidence, not a mandatory serial sprint schedule. Catalog and identity tasks can run in parallel after SQL conventions. Private Rx storage and payment adapter setup can proceed in parallel while business rules are being signed off, but cannot be enabled before the corresponding safety/owner gates are approved.

Basic warehouse transfers are needed in the current operational flow but Phase 1 vs Phase 2 ownership remains D-002. Hosted PG15, integration credentials and production content are external dependencies and can block release despite completed coding. See Roadmap.
