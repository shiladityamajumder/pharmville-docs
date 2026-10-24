# Product Catalog edge cases

> [!NOTE]
> **Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Catalog-and-Product-Discovery.md) · [LLD and normal tests](LLD.md) · [API](APIs.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-CAT-01-01` | `CAT-01` | Inactive category is requested from an old link | No unpublished contents leak; clear empty/unavailable result | Catalog editor corrects publication; customer browses current categories | `TC-CAT-01-DENY` |
| `EC-CAT-02-01` | `CAT-02` | Product commerce classification is unknown | Ordering blocked rather than defaulting to M/O | Catalog and Pharmacy approve classification | `TC-CAT-02-DENY` |
| `EC-CAT-03-01` | `CAT-03` | Search backend fails | Unavailable result differs from valid no matches; no fabricated substitution | Search owner restores service; customer can browse | `TC-CAT-03-DENY` |
| `EC-CAT-04-01` | `CAT-04` | Stock observation exceeds approved freshness | Availability cannot authorize a new hold | Inventory restores authoritative evidence | `TC-CAT-04-DENY` |
| `EC-CAT-05-01` | `CAT-05` | Similar-name product has different strength | Not treated as an interchangeable approved P line | Pharmacy reviews candidate; customer accepts a permitted revision | `TC-CAT-05-DENY` |
| `EC-CAT-06-01` | `CAT-06` | Image asset returns not found | Product remains readable; no broken-image-only purchase cue | Catalog editor replaces missing asset | `TC-CAT-06-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
