# Customer Accounts dependencies and decisions

**Accountable role proposed:** Customer platform. Approval is not inferred from documentation completeness.

## Domain dependencies

- Authentication_Access. See [exact table/API mapping](Database.md).
- Cart_Checkout. See [exact table/API mapping](Database.md).
- Customer_Accounts via Privacy/Legal owner. See [exact table/API mapping](Database.md).
- Order_Operations. See [exact table/API mapping](Database.md).
- Prescription_Upload. See [exact table/API mapping](Database.md).
- Product_Catalog. See [exact table/API mapping](Database.md).

Profiles, addresses, family associations and consent; delegates credentials and sessions to Authentication.

## Decision gates

D-003; D-010; D-023; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 19 |
| Documentation-complete proposed | 18 |
| Incomplete contracts | API-004 |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
