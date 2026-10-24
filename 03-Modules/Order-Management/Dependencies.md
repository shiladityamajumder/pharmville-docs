# Order Management dependencies and decisions

**Accountable role proposed:** Order operations. Approval is not inferred from documentation completeness.

## Domain dependencies

- Admin_CMS. See [exact table/API mapping](Database.md).
- Delivery_Operations. See [exact table/API mapping](Database.md).
- Finance_Payments. See [exact table/API mapping](Database.md).
- Inventory. See [exact table/API mapping](Database.md).
- Pharmacist_Review. See [exact table/API mapping](Database.md).
- Product_Catalog. See [exact table/API mapping](Database.md).
- Store_Operations. See [exact table/API mapping](Database.md).
- Warehouse. See [exact table/API mapping](Database.md).

Order aggregate, revisions and orchestration; consumers request commands rather than directly mutating order state.

## Decision gates

D-002; D-004; D-006; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 5 |
| Documentation-complete proposed | 5 |
| Incomplete contracts | None |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
