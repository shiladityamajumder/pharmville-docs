# Payments dependencies and decisions

**Accountable role proposed:** Finance / Payments. Approval is not inferred from documentation completeness.

## Domain dependencies

- Inventory. See [exact table/API mapping](Database.md).
- Order_Operations. See [exact table/API mapping](Database.md).
- Pharmacist_Review. See [exact table/API mapping](Database.md).
- Shared platform file service — engineering owner; no clinical write grant. See [exact table/API mapping](Database.md).

Money, refunds, invoices, accounting and reconciliation; no direct clinical or stock approval.

## Decision gates

D-004; D-007; D-008; D-011; D-012; D-016; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 7 |
| Documentation-complete proposed | 3 |
| Incomplete contracts | API-075, API-076, API-079, API-080 |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
