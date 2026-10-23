# Prototype validation results

Validated locally on **23 October 2026** against the current HTML/CSS/JavaScript and local Chrome. These checks establish prototype behavior and layout; they do not approve production policies or integrations.

## Measured results

| Check | Actual result |
|---|---|
| Registered screens / draft features | 83 unique screens; all 110 source feature IDs retain mappings |
| Feature classification | 70 screen, 23 interaction/state, 16 decision-blocked, 1 backend-only |
| Stable scenarios | 35 definitions; 718 legacy screen/scenario render visits |
| Full browser regression | 114 assertions passed; no JavaScript errors, unresolved hash links, document overflows, duplicate HTML IDs, unlabeled normal-screen inputs or external requests detected |
| Product UX regression | 13 assertions passed; 30 fresh representative captures |
| Experience acceptance | 170 assertions passed; no JavaScript errors |
| Supported experience layouts | 113 explicit route/platform visits: Mobile at 390 px, Website at 1440 px |
| Responsive regression | All 83 legacy routes at 360 × 800, 390 × 844, 430 × 932, 768 × 1024, 1280 × 800 and 1440 × 900 |
| Platform/scenario matrix | 931 associations: 113 normal render/layout checks, 11 named behavior checks, 807 behavior-unverified rows |
| Static prototype validation | 83 screens, 110 features, 35 scenarios, 104 registered screen action/form names; zero errors; entry controls/routes and required new assets also checked |
| Repository documentation validation | 517 Markdown files, 11,665 links, 1,699 tables and all 96 Mermaid diagrams parsed; zero errors or missing mappings; 23 existing API-reference gaps remain reported |
| Git change validation | git diff --check passed; changes stay inside the existing wireframe project |
| Fresh experience screenshots | 22 captures in ignored artifacts/experiences; all 18 requested categories included |

## Executed demonstrations

Mobile and Website each execute experience selection, checkout deep link and refresh, valid fictional checkout preparation, unknown pending payment, repeated attempt/status checks, network interruption and state-preserving scenario exit. Separate shopping paths operate Search → Product → Cart → Address → Patient → Summary → Payment → captured-confirmation recovery → tracking. Identity/address setup is labelled test setup; purchase and payment effects use existing UI handlers. A Mobile-added item retains quantity and price on Website. Browser Back/Forward restores the explicit Website context.

The prescription path actually adds a prescription medicine, accepts its summary, submits a fictional filename, and uses Continue as Pharmacist. The role changes deliberately to the Website Pharmacist while retaining the same unapproved order. An actual rejected-line reason is projected to Customer and payment remains blocked. The fulfillment failure path starts with a fresh eligible COD purchase, then actually accepts, picks, packs, assigns, signs in the rider, accepts the task, hands over custody, confirms pickup and records failure. Rider, Customer and Dispatch see the same reason without a delivered state or invented collected cash.

Incorrect OTP checks request a challenge, submit the wrong code, assert the contextual error and absent session, and correct the code through the permitted retry. Stock shortage removes checkout and provides a working return to shopping. A labelled refund fixture remains Pending rather than displaying a completed payout. The original regression additionally checks exact stock movements and replay, clinical approval, delivery proof/offline recovery, cancellation/refund idempotency and cumulative bounds, warehouse receipt/transfer, COD exceptions, reports, access revocation and MFA.

## Visual review

Fresh chooser/selectors, Mobile and Website home/product/cart/checkout/pending-payment views, prescription rejection, desktop pharmacist review, Rider task, failed delivery and guided handoff were inspected. Review confirms bottom versus header navigation, stacked versus column/table layouts, action placement, status consistency and recovery messages. Supporting captures cover stock shortage, journeys and refund pending. Files are local ignored artifacts, not published assets. Layout checks and screenshot review do not establish full usability or WCAG conformance.

## Reproduce

Start the server as described in [How to Run](How-to-Run.md), then run from repository root:

```text
node 10-Low-Fidelity-Wireframes/tools/generate-documentation.mjs
node 10-Low-Fidelity-Wireframes/tests/browser.mjs
node 10-Low-Fidelity-Wireframes/tests/product-ux.mjs
node 10-Low-Fidelity-Wireframes/tests/experience-flows.mjs
node 10-Low-Fidelity-Wireframes/tools/generate-experience-coverage.mjs
node 10-Low-Fidelity-Wireframes/tools/validate-prototype.mjs
npm run validate
git diff --check
```

The experience coverage generator requires a successful browser result and links exact EXP assertion IDs. Normal rendering is distinct from tested business behavior. The full regression deliberately selects reviewer personas for broad route visits; direct role denial is independently tested. Browser QA reuses existing development dependencies and local Chrome; set PUPPETEER_EXECUTABLE_PATH where needed. Running the prototype itself requires no install.

## Limits

[Platform coverage](Platform-and-Screen-Coverage.md) and [scenario coverage](UX-State-Coverage.md) retain untested behavior explicitly. The 16 policy decisions and backend-only AUTH-04 remain classified in [Feature Coverage](Feature-Coverage.md). Role controls are browser simulations. Some domain validation still uses page notices. Full assistive-technology review, real-device/background behavior and exhaustive scenario interaction testing remain open. CSV/TSV, filenames, maps, messages, provider outcomes and money remain local simulations. No database, backend, clinical approval policy, real payment or hosted deployment was changed. No commit or push was made.
