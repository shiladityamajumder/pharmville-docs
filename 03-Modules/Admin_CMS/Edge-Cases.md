# Admin CMS edge cases

**Status: Designed; NOT RUN.** These are feature-specific acceptance assertions for the existing draft requirements. Policy values remain subject to [decisions](../../09-References/Sources-and-Decisions.md); provider behavior and application execution are not certified.

[Business explanation](../../00-Business-Guide/Admin-and-Operations.md) · [LLD and normal tests](LLD.md) · [API](../../05-APIs/Admin_CMS.md) · [recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md)

| Case | Feature | Trigger | Expected result and record impact | Responsible recovery | Test |
| --- | --- | --- | --- | --- | --- |
| `EC-ADM-01-01` | `ADM-01` | Store user changes location filter to another store | No other-location orders or patient counts disclosed | Manager corrects assignment; Security tests filter enforcement | `TC-ADM-01-DENY` |
| `EC-ADM-02-01` | `ADM-02` | Deactivated staff uses an old session | Protected command denied under approved revocation policy | Security verifies revocation propagation | `TC-ADM-02-DENY` |
| `EC-ADM-03-01` | `ADM-03` | Staff attempts to grant itself a privileged role | No self-authorized privilege increase | Authorized Security/manager reviews grants | `TC-ADM-03-DENY` |
| `EC-ADM-04-01` | `ADM-04` | Two editors publish from the same stale draft | Stale publish conflicts; one accepted version remains | Editor reloads and resolves change | `TC-ADM-04-DENY` |
| `EC-ADM-05-01` | `ADM-05` | Fee change is applied to an already accepted basket | No silent reprice; explicit revision if allowed | Product/Finance approves setting and customer consent path | `TC-ADM-05-DENY` |
| `EC-ADM-06-01` | `ADM-06` | Admin submits unsupported HSN/tax or clinical class | Invalid publication blocked; no direct bypass of Catalog/Finance/Pharmacy | Responsible catalog/tax/clinical owner corrects approved master | `TC-ADM-06-DENY` |
| `EC-ADM-07-01` | `ADM-07` | Sheet contains duplicate SKU and malformed price | Specific row errors; no silent duplicate product or partial unknown outcome | Catalog owner reviews approved import atomicity and retries corrected input | `TC-ADM-07-DENY` |
| `EC-ADM-08-01` | `ADM-08` | Expired license site is marked operationally open | Open flag cannot make site eligible for regulated fulfillment | Operations/Pharmacy renew approved license evidence | `TC-ADM-08-DENY` |
| `EC-ADM-09-01` | `ADM-09` | Expired offer is submitted from an old basket | Reprice/reaccept; no stale unapproved discount | Product approves offer; customer reviews total | `TC-ADM-09-DENY` |

## Verification procedure

For each linked test, seed the stated current actor, scope and record version; apply the trigger; assert the visible result and authoritative rows, history and emitted events. Repeat after a lost acknowledgment where the scenario concerns replay. Normal companion tests are `TC-<feature>-OK` in the LLD. Use approved policy fixtures, not production assumptions.

For state-changing commands also verify rollback before commit, timeout after commit, cross-object denial and conflicting versions. Run real provider signature tests only against the approved sandbox. Attach execution evidence and fixture versions before changing NOT RUN.
