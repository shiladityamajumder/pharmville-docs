# Prototype validation results

Validated locally on **25 October 2026** against the current HTML/CSS/JavaScript and cached Chromium. These checks establish local prototype behavior, linked demo state and layout; they do not approve production policy, API implementation, database execution or external integrations.

## Current run

| Check | Executed result | Evidence boundary |
|---|---|---|
| Prototype registry and source traceability | 91 unique screens; all 110 inherited feature IDs mapped across 18 module groups; 35 scenarios; 779 screen/scenario associations; 111 registered action/form names; zero static errors | `tools/validate-prototype.mjs`, `artifacts/static-results.json` |
| Full browser regression | Passed 116 assertions; visited all 91 screens and 779 screen/scenario combinations at 360×800, 390×844, 430×932, 768×1024, 1280×800 and 1440×900; zero JavaScript errors, broken routes, overflows, unlabeled normal inputs/duplicate IDs or external requests | `tests/browser.mjs`, `artifacts/browser-results.json` |
| Product UX regression | Passed 13 assertions; created 30 representative screenshots; zero errors | `tests/product-ux.mjs`, `artifacts/product-ux/results.json` |
| Experience-flow regression | Passed 179 assertions; zero errors | `tests/experience-flows.mjs`, `artifacts/experiences/results.json` |
| Shared-domain flow test | Passed; 29 handled actions and all inline assertions across identity/workspace step-up, procurement stock recovery, reverse logistics/refund and support lifecycle | `tests/domain-workflows.mjs` output |
| Extended browser workflows | Passed 11 assertions across PO-linked stockout recovery, return pickup/quarantine/refund and support lifecycle using actual forms; zero JavaScript errors | `tests/extended-workflows.mjs`, `artifacts/extended-workflow-results.json` |
| Coverage generation | 91 screens; 122 normal experience visits; 1,000 documented screen/platform/scenario rows; 11 named behavioral assertion mappings | `tools/generate-experience-coverage.mjs`, `documentation/UX-State-Coverage.md` |
| Documentation generation | 91 screens; 18 source modules; 110 feature IDs; 35 scenarios; 779 screen/scenario combinations; classification: 70 screen, 23 interaction/state, 16 decision-blocked, 1 backend-only | `tools/generate-documentation.mjs` |
| Markdown relative links | 16 Markdown files scanned; no missing relative targets | Targeted local link check for this wireframe directory and referenced project documents |
| Git whitespace and scope | `git diff --check` passes; final status contains changes only under `10-Low-Fidelity-Wireframes/` | Repository status and diff review |

Scenario rendering is not equivalent to behavioral testing. The matrices retain unverified cases as unverified. All generated PNGs and result JSON are local ignored artifacts under this directory.

## New journey verification

The unified identity demo verifies password plus authenticator for staff, OTP adapters for customer/rider, generic failure for unknown staff identifiers, assignment-derived workspaces, denial of an unauthorized workspace, context activation only after a step-up prompt for proposed elevated destinations, and local session revocation. It does not claim real credential validation or backend authorization.

The PO-linked stockout path records a store request, a synthetic unverified supplier reference, a local purchase-order approval, linked warehouse receipt, transfer in transit and actual destination receipt. Customer availability changes only after store receipt. The return path records an owner-supplied eligibility reference, dispatcher assignment, current-rider custody, physical warehouse receipt/quarantine, separate Finance decision and separate synthetic refund. The support path records an OTP-authenticated customer case, staff lifecycle updates, and customer-visible status from shared browser state.

These workflows use only fictional records. The local PO is not transmitted; return criteria are not invented; quarantined items are not restocked; no supplier, SMS, payment, maps, GPS, email or push provider is contacted.

## Reproduce

Start the local server as described in [How to Run](How-to-Run.md), then run from the repository root:

```bash
node 10-Low-Fidelity-Wireframes/tools/generate-documentation.mjs
node 10-Low-Fidelity-Wireframes/tests/browser.mjs
node 10-Low-Fidelity-Wireframes/tests/product-ux.mjs
node 10-Low-Fidelity-Wireframes/tests/experience-flows.mjs
node 10-Low-Fidelity-Wireframes/tests/domain-workflows.mjs
node 10-Low-Fidelity-Wireframes/tests/extended-workflows.mjs
node 10-Low-Fidelity-Wireframes/tools/generate-experience-coverage.mjs
node 10-Low-Fidelity-Wireframes/tools/validate-prototype.mjs
git diff --check
```

Browser tests use the repository's existing development-only Puppeteer and local Chrome. Set `PUPPETEER_EXECUTABLE_PATH` if Chrome is not detected automatically. The prototype itself needs no install and has no runtime network dependency.

## Limits

The 16 owner-dependent feature decisions and backend-only AUTH-04 remain as listed in [Feature Coverage](Feature-Coverage.md). Proposed Procurement and support roles, return policy outcomes, and elevated step-up targets remain unapproved. The demo does not implement production authentication/session controls, database/API behavior, provider contracts, financial or clinical policy, or persistent server state.

The automated checks do not establish WCAG conformance or usability on real devices. Full assistive-technology review, moderated task research, real rider GPS/background behavior, provider integration and exhaustive interaction tests for all 1,000 matrix rows remain open. No test result in this report claims application or production test success.
