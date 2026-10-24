# Audit dependencies and decisions

**Accountable role proposed:** Security / Audit platform. Approval is not inferred from documentation completeness.

## Domain dependencies

- Reporting. See [exact table/API mapping](Database.md).

Append-only evidence infrastructure and authorized audit reads; business domains own command effects.

## Decision gates

D-010; D-013; D-024. See the [business decision register](../../09-References/Sources-and-Decisions.md) and [API decision detail](../../05-APIs/Planning-Decisions.md). Future physical domains require D-027 ownership/scope review.

| Planning item | Current evidence |
| --- | --- |
| Surface operations | 2 |
| Documentation-complete proposed | 2 |
| Incomplete contracts | None |
| Approved / implemented | 0 / 0 |
| Runtime/provider/application evidence | Not executed; schema-only parity is independently validated |

[Journey gaps](../../05-APIs/Journey-API-Gaps.md) preserve proposed missing commands without expanding the 107-operation denominator. No provider, financial or clinical dependency is implicitly approved.
