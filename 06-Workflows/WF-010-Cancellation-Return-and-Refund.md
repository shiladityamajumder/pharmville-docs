# WF-010 — Cancellation Return and Refund

**Status:** Proposed orchestration based on draft requirements and existing DB contracts. This is not an observed deployed workflow.

**Actor:** Customer / operations. **Trigger:** cancel or request eligible return.
**Preconditions:** Valid session and per-resource scope; approved policy data and current serviceability or eligibility where relevant.
**Expected outcome:** approved action, money/stock compensations or pending.

## Normal path

1. Resolve trusted identity and current entity version.
2. Check classifications, licensing, money, consent and location conditions appropriate to this workflow.
3. Validate request payload and expected state.
4. Commit owning module rows and audit/outbox atomically.
5. Publish any external side effect only after commit and record correlation IDs.
6. Return an honest status and allow safe resume.

## Data ownership and API boundary
**Modules:** Customer_Orders, Finance_Payments, Inventory, Order_Operations.
**Existing tables involved (candidates):** `commerce.cancellations`, `commerce.returns`, `payment.refunds`, `warehouse.stock_ledger`.
**Related proposed APIs:** API-025, API-026, API-027, API-028, API-029, API-030, API-031, API-075, API-076, API-077; additional related contracts are in module API indexes.

## Alternative / failure flows
- **Example failure:** already shipped, partial allocation, refund timeout. Do not make an optimistic success assertion.
- **Duplicate operation:** accept only the same idempotent result or issue a version conflict; never duplicate stock or money movements.
- **Provider/network timeout:** leave a pending reconciliation state; never infer a paid/delivered/reviewed outcome.
- **Unauthorized or expired identity:** deny, audit outcome as policy allows, and avoid revealing another user’s resource.
- **Compensation:** when separate providers or ledgers are involved, use explicit compensating actions after durable evidence. Never silently reverse historic finance or clinical records.

## Sequence (design)
```mermaid
sequenceDiagram
  participant A as Customer
  participant API as API gateway
  participant O as Owning module
  participant PG as PostgreSQL
  participant P as Outbox/provider
  A->>API: cancel or request eligible return
  API->>O: Trusted actor + validated intent
  O->>PG: Scope + version/constraint check
  alt policy or concurrency conflict
    PG-->>O: Denied / no commit
    O-->>A: Correctable error or pending state
  else accepted
    O->>PG: Atomic facts + outbox/audit
    PG-->>O: Commit + accepted public ID
    O-->>A: Safe status
    O-->>P: Post-commit side effect, if needed
  end
```

**Required QA:** approved happy path, denial, replay, race, provider outage, stale state, and actor-scope negative test; testing strategy.
