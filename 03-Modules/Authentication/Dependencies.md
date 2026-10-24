# Authentication dependencies and decisions

**Accountable role proposed:** Security / Identity. Approval is not inferred from documentation completeness.

## Domain dependencies

- Customer_Accounts. See [exact table/API mapping](Database.md).

Authentication mechanics and role grants; customer login endpoints retain their historical customer contract surface.

## Decision gates

D-003; D-023; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 5 |
| Documentation-complete proposed | 3 |
| Incomplete contracts | API-089, API-090 |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
