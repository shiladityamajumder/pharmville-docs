# Product Catalog dependencies and decisions

**Accountable role proposed:** Catalog / Merchandising. Approval is not inferred from documentation completeness.

## Domain dependencies

- Admin_CMS. See [exact table/API mapping](Database.md).
- Delivery_Operations. See [exact table/API mapping](Database.md).
- Finance_Payments. See [exact table/API mapping](Database.md).
- Inventory. See [exact table/API mapping](Database.md).
- Shared platform file service — engineering owner; no clinical write grant. See [exact table/API mapping](Database.md).
- Shared platform runtime — engineering owner. See [exact table/API mapping](Database.md).

Catalog/classification and discovery; tax meaning remains Finance-owned and search is derived.

## Decision gates

D-007; D-012; D-019; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 8 |
| Documentation-complete proposed | 7 |
| Incomplete contracts | API-015 |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
