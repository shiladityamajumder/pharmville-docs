# Notifications dependencies and decisions

**Accountable role proposed:** Communications / Platform. Approval is not inferred from documentation completeness.

## Domain dependencies

- Order_Operations. See [exact table/API mapping](Database.md).
- Shared platform runtime — engineering owner. See [exact table/API mapping](Database.md).

Notification messages and attempts; source domains own business events and customer support remains a separate scope decision.

## Decision gates

D-005; D-010; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 4 |
| Documentation-complete proposed | 4 |
| Incomplete contracts | None |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
