# Warehouse dependencies and decisions

**Accountable role proposed:** Warehouse / Procurement. Approval is not inferred from documentation completeness.

## Domain dependencies

- Admin_CMS. See [exact table/API mapping](Database.md).
- Inventory. See [exact table/API mapping](Database.md).
- Order_Operations. See [exact table/API mapping](Database.md).

Warehouse geometry, receiving and transfers/procurement; Inventory owns stock ledger and balances.

## Decision gates

D-002; D-007; D-012; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 4 |
| Documentation-complete proposed | 4 |
| Incomplete contracts | None |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
