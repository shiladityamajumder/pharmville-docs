# Prototype design decisions

## Scope and source priority

Current sources contain 110 inherited draft features, 18 module groups, a Business Guide and 14 technical workflows. No signed product approval was introduced by this task. [Sources and decisions](../../09-References/Sources-and-Decisions.md) remains the owner register. Wireframes demonstrate proposed UX without changing HLD, LLD, application code or SQL.

Customer and rider are mobile-first experiences. Administration, pharmacy, fulfillment, inventory, delivery management, finance, reporting and audit are views of one shared protected staff experience. The Explorer groups workspaces for navigation; it does not propose fifteen separate applications.

## UX choices

- Experience mode is the initial view. Product screens show the user task and its next action; feature IDs, screen IDs, role selection, scenario details and reset controls live in the Review tools dialog. The fictional-demo banner is compact and stays outside the workflow.
- The initial chooser contains three entry cards. Mobile App and Website have independent searchable screen selectors; the full technical directory is a secondary destination. Customer/rider belong to Mobile; Customer/staff belong to Website. This does not invent native apps for backend modules.
- Journey controls preserve the current demo record across route changes. Required actions gate progress and explain what is missing. Guided role handoffs change the simulated workspace directly while preserving the same record; permission checks and business approvals still apply.
- Mobile, tablet and desktop previews size the app surface, and container queries apply the matching internal layout independently of the browser window. Responsive mode follows the actual viewport. Customer navigation uses a single header or bottom bar at the matching app width.
- The first visit starts with an empty shopping demo. Guided journeys offer to keep that state or load a clearly labelled prepared fictional fixture; replacing existing progress requires confirmation. Prepared historical fixtures are labelled and never imply a new payment, approval, stock movement or delivery.
- White/gray/black, borders, system fonts and labelled placeholders emphasize hierarchy and behavior. Mobile operational tables become cards retaining column labels; no dense table is simply clipped.
- Hash routes support direct links, Back/Forward and refresh under a project subpath. One shared order and append-only demonstration movements connect customer, pharmacy, stock, fulfillment, rider and finance. Browser storage persists the demo and updates other local tabs, not real devices.
- Selecting a screen card explicitly chooses its illustrative role/site. Entering a workspace URL retains the current persona and denies inappropriate access. These controls simulate permissions; they are not production authentication. Explicit session revocation blocks protected staff forms until demo MFA completes.
- Native dialogs support keyboard focus, Escape and return to the invoking action. Inputs have labels and visible focus; errors/statuses are announced without relying on color.

## Clinical, payment and stock sequence

P lines require current patient/evidence and pharmacist choices before payment. M/O-only baskets skip that branch. Partial decisions preserve eligible lines and require explicit customer acceptance. The detailed journey takes priority for this demonstration; RX-02 deferred upload remains blocked because its deadline/capture/compensation rules conflict with that path.

The accepted quote and exact eligible site stock gate payment. “Paid, confirmation lost” stores one pending attempt and permits reconciliation of its trusted synthetic record. Packing/delivery cannot interpret a redirect, map point or message as clinical/financial truth. COD begins as amount due and becomes actual collection only with accepted doorstep proof. Refund intent, approval, trusted completion and reconciliation stay separate.

## Deliberate limits and blocked work

- OTP codes (`246810`, delivery `135790`), synthetic PIN (`000000`), fees, amounts and approval examples are illustrative, not approved timeout/cap/medical policies.
- Prescription “upload” takes fictional filenames only. It does not read files, render medical documents or validate prescriptions.
- No real auth, password storage, provider request, WhatsApp/SMS/push, GPS, map/call or financial transaction occurs. Local code is not a security boundary.
- Bulk tabular import uses pasted CSV rather than reading Excel workbooks. Export creates Excel-readable TSV, not native XLSX. These format approximations support UX review and are not claimed spreadsheet integrations.
- Legal invoices, GST filing definitions, credit-note issuance, real COD destination proof, offers activation, warehouse dispensing fallback, urgent capacity, rider earnings and doorstep clinical SOPs are blocked/proposed where policy is missing. Their screens explain the missing decision or record a review request; they do not fabricate approved outcomes.
- No put-away workflow is invented; the current scoped receiving/lot flow has no approved put-away requirement. Future diagnostics, insurance, teleconsultation, membership and marketplace schemas do not create extra wireframe scope.

See [feature coverage](Feature-Coverage.md) for each classification and its actual UI evidence.

## Product-quality redesign decisions

The shell owns customer primary navigation; screen renderers no longer inject another copy. Desktop search uses a filter sidebar, product detail separates image from purchase controls, and cart/checkout use a side summary. The same records and business handlers serve phone layouts.

Opening a URL preserves the current simulated role. Role cards, the Review role selector, starting a guided journey and explicit guided handoffs are deliberate persona switches. Protected routes show access restrictions rather than granting another role. These remain browser simulation controls, not backend authentication.

Fixture provenance is available in Review tools. Prepared examples carry a short visible label; fresh browsing no longer repeats a long fixture explanation. Essential policy blocks remain visible; supporting policy references are expandable. Required/native-format errors appear beside fields, while business-rule errors retain the existing domain handlers.

## Experience routing and on-screen situations

Experience-prefixed hash routes determine Mobile or Website presentation. A preview override can temporarily inspect tablet/responsive layouts; refresh restores the URL’s experience. Internal legacy screen links are qualified at render time. Supported old links keep working without silently changing roles. Switching experience retains the shared browser records.

“What if something goes wrong?” uses ordinary language separate from the stable technical scenario definitions. Payment conditions invoke the existing payment handler and preserve its reference, quote, stock and clinical gates. Pending operations must be checked before exploring a different outcome; confirmed orders cannot be relabelled pending. Other scenario selections are condition previews with existing command guards, not automatic business decisions. Returning to normal never rolls back a recorded action. A checkout example requires explicit replacement confirmation and creates no payment or clinical approval.

Actual rejection reasons and delivery-failure reasons project to Customer and operational views. An unsuccessful delivery retains custody and actual cash separately. [Platform coverage](Platform-and-Screen-Coverage.md) and [scenario coverage](UX-State-Coverage.md) distinguish normal-layout verification from interaction evidence. Unverified behavior is deliberately left unverified.
