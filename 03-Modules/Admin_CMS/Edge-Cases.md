# Admin CMS edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Admin Portal, CMS & Masters — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `ADM-01` | Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-02` | Staff users: invite, assign role and location, deactivate, log out sessions | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-03` | Roles and permissions for 16 roles, limited to own store or warehouse | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-04` | CMS: home banners, FAQs, policy pages, with draft and publish | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-05` | System settings (PRD section 8) | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-06` | Catalogue admin: products, categories, brands, salt master, prices, GST and HSN | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-07` | Bulk product import from Excel, with error report | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-08` | Store and warehouse master: address, hours, GSTIN, service areas | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `ADM-09` | Offer settings: start and end dates, maximum discount, first-order offer | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
