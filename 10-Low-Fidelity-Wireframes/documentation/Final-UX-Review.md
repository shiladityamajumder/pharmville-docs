# Final UX review

Reviewed on 23 October 2026 against the current local implementation and fresh browser artifacts. This review reports tested behavior rather than assigning a new usability score. Real-user research, full assistive-technology testing and exhaustive scenario interactions remain open.

## Defects corrected

| Problem | Implemented result | Evidence |
|---|---|---|
| Mobile and Website entry actions entered the same customer route with a preview toggle | Dedicated chooser, independent searchable screen selectors and experience-prefixed URLs | Experience browser tests operate both selectors, refresh, Back/Forward, internal links and unsupported routes |
| First visit exposed too much screen-directory detail | Three entry cards; full directory remains secondary | Fresh chooser and selector screenshots |
| Platform choice could be lost during navigation | URL context determines presentation and qualifies internal screen links; legacy links remain supported | Separate Mobile and Website shopping paths and explicit route sweep |
| Edge cases required technical Review tools | On-screen “What if something goes wrong?” controls with plain-language explanations and recovery | Actual pending payment, network, stock, OTP, rejection, delivery failure and refund assertions |
| A recorded rejection could lose its reason in Customer status | Customer reads the actual recorded rejected-line reason | Pharmacist rejection followed by Customer visible-text and payment-block checks |
| Failed delivery could fall back to an ordinary preparing status | Rider, Customer and Dispatch show the same failure reason; no delivered state or invented cash | Actual rider failure action and shared-state assertions |
| Choosing another payment situation could imply a different result for an already confirmed operation | Confirmed orders retain their result; pending references must be checked before another outcome | Confirmed-payment guard and repeated pending/status checks on both platforms |

## Implemented experience

Mobile has customer bottom navigation, stacked product/cart/checkout content and Rider task views. Website has customer header navigation, product and purchase columns, tabular cart with a side summary, and staff workspaces with task navigation. Selection is durable URL context; selecting a screen explicitly chooses its demonstration persona. Direct navigation preserves the current role. Unsupported Staff Mobile and Rider Website combinations provide helpful handling.

Nine guided tasks remain available. Required actions gate continuation and explain what is missing. The prescription handoff explicitly offers Continue as Pharmacist, opens the Website workspace and retains the submitted order. Prepared starting records require deliberate selection and confirmation before replacing progress.

Situation selection and accepted business commands remain distinct. Payment situations use the existing quote, stock, clinical and payment handlers. Other situation controls preview the task’s condition and retain its existing command checks. Returning to normal does not reverse recorded money, stock, review or delivery effects. The optional checkout example creates an eligible fictional checkout without creating a payment or approval.

## Browser and visual evidence

The explicit-experience suite passes **170 assertions** with no JavaScript errors. It exercises both shopping paths from selection through search, exact product, cart, address, patient, accepted summary, lost-confirmation payment recovery and order tracking. Account/address setup is explicitly supplied as a test fixture; shopping and payment actions use the UI. It verifies Mobile-added cart quantity/price on Website, unknown pending payments without duplicate references, real prescription upload and handoff, actual pharmacist rejection, store picking/packing, assignment, rider acceptance/custody/pickup, real failed delivery and pending refund projection.

Every supported experience-prefixed screen is also checked in its intended normal layout: Mobile at 390 px, Website at 1440 px. The existing full suite separately visits 83 legacy screens, 718 screen/scenario combinations and all six required widths. Product UX regressions pass 13 assertions. See [Validation Results](Validation-Results.md) for final counts and commands.

Fresh screenshots in ignored `artifacts/experiences/` cover the chooser, both selectors, both customer homes/products/carts/checkouts/pending payments, prescription rejection, pharmacist decision, Rider task, failed delivery and guided handoff. Additional captures show stock shortage and refund pending. The [platform matrix](Platform-and-Screen-Coverage.md) records actual normal-layout evidence; the [scenario matrix](UX-State-Coverage.md) marks other behavior unverified unless associated with a named interaction assertion.

## Remaining limits

The 16 existing policy-dependent features remain blocked/proposed and AUTH-04 remains backend-only in [Feature Coverage](Feature-Coverage.md). This work approves no clinical, refund, COD, tax, stock-authority, rider or privacy policy. Role selection is a local simulation, not server authentication. Some domain errors still use page notices rather than individual field feedback. Many scenario associations have rendering evidence only; they require dedicated behavior/recovery tests. Full keyboard/screen-reader review, real-device/background operation and moderated task testing remain unverified. CSV/TSV, files, providers, OTP, maps and money remain simulated as documented.
