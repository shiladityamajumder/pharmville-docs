# Delivery dependencies and decisions

**Accountable role proposed:** Delivery operations. Approval is not inferred from documentation completeness.

## Domain dependencies

- Admin_CMS. See [exact table/API mapping](Database.md).
- Authentication_Access. See [exact table/API mapping](Database.md).
- Finance_Payments. See [exact table/API mapping](Database.md).
- Order_Operations. See [exact table/API mapping](Database.md).
- Shared platform file service — engineering owner; no clinical write grant. See [exact table/API mapping](Database.md).
- Store_Operations. See [exact table/API mapping](Database.md).

Assignments, custody, attempts, OTP/location facts; rider is a scoped client and Finance owns COD money.

## Decision gates

D-008; D-010; D-011; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 5 |
| Documentation-complete proposed | 4 |
| Incomplete contracts | API-066 |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
