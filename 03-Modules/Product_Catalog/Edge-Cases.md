# Product Catalog edge cases

**Coverage status:** the rows below are module review prompts. Repeated failure text does not establish feature-specific edge coverage. Specify input, ownership, transaction, retry and recovery assertions for each feature under [D-024](../../09-References/Sources-and-Decisions.md#decisions-that-block-implementation).


## Edge Cases

## Product Catalog & Search — documented edge cases

**Source:** v0.1 feature inventory, journey v3 exception rules and final DB guard report. These are minimum testable failure outcomes, not replacements for pharmacy/owner policy signoff.

| Feature | Affected behavior | Trigger | Expected recovery |
| --- | --- | --- | --- |
| `CAT-01` | Browse by category and sub-category | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `CAT-02` | Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `CAT-03` | Search by name, brand and composition, with typo tolerance and autosuggest | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `CAT-04` | Availability for the customer's pin code (in stock / out of stock) | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `CAT-05` | Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |
| `CAT-06` | Placeholder image when a product has none | Unapproved classification/content, stale import or retired master | Do not publish unsafe record; expose import/approval errors |

Across every route also test expired sessions, cross-tenant or location IDOR attempts, duplicate taps, two workers updating the same object, timeout after commit, out-of-order events and unapproved values. Never quietly continue a safety-sensitive workflow by interpreting a missing answer as consent. See Error_Handling and Testing.
