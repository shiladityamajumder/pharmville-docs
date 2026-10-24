# Pagination and filtering

**Offset pagination:** verified in the sibling authentication service only. Its implementation uses `limit=20`, `offset=0`, maximum `limit=100`, maximum `offset=100000`, and returns `{totalCount, limit, offset, hasNext}` in `meta.pagination`. These values are a reference, not a Pharmville policy.

**Cursor pagination:** proposed for Pharmville volatile queues and histories. It is not implemented by the reference authentication service. The response metadata is `{nextCursor, hasNext}`; `nextCursor` is null when no next page is available. The cursor is opaque, integrity-protected, bound to the authenticated scope, filter, sort and cursor-version. Do not put patient, customer, location or internal database identifiers in readable cursor contents. Cursor expiry and signing-key rotation require implementation design; do not promise snapshot isolation.

## Proposed pagination request conventions

Adopt one strategy per list operation under D-024:

| Strategy | Query parameters | Proposed defaults and bounds | Metadata |
|---|---|---|---|
| Offset | `limit`, `offset` | Reference defaults 20/0 and maxima 100/100000; proposed for stable, low-churn lookup lists pending owner approval | `totalCount`, `limit`, `offset`, `hasNext` |
| Cursor | `limit`, optional `cursor` | Proposed default 20, maximum 100 pending owner approval; omit cursor for first page | `nextCursor`, `hasNext` |
| No pagination | None | Resource/detail or bounded singleton read | `null` |

Do not send both `offset` and `cursor`. Invalid, expired, tampered, or scope-mismatched cursors return 422 `VALIDATION_ERROR` or a more specific approved code; do not reveal the cursor’s former scope.

## Initial strategy proposal by operation

These are design proposals, not evidence of existing query support. Each operation owner must confirm an allowlisted sort key, stable tie-breaker and corresponding query/index before approving the contract.

- **Cursor proposal:** API-025, API-039, API-044, API-055, API-057, API-059, API-060, API-064, API-067, API-070, API-077, API-079, API-082–085, API-087, API-095, API-097, ACC-ROUTE-005, ACC-ROUTE-008. These are queues, histories or potentially high-volume collections.
- **Offset proposal:** API-005, API-007, API-010, API-011, API-013, API-030, API-050, API-093. Confirm result stability and total-count query cost before approval.
- **No pagination proposed:** single-resource reads such as API-003, API-012, API-026, API-029, API-031, API-040, API-061, API-081 and ACC-ROUTE-006. Reports with aggregate filters should define report-specific parameters, not generic pagination by default.

API-014 is a single product/postal-code advisory lookup with pagination explicitly omitted. This list does not assert that every route is already a supported API. The owning Markdown contract and OpenAPI must identify the chosen strategy and exact filters for each list. Do not invent undocumented filter or sort fields. Where absent, the contract is incomplete pending D-024.

## Filtering and ordering rules

- Derive customer, patient, staff, store, warehouse, pharmacy, rider and organization scope from the authenticated server-side principal. A client-supplied scope may narrow an authorized result only where the operation explicitly documents it.
- Allowlist filter and sort properties per endpoint. Never accept SQL fragments, arbitrary column names or unbounded search strings.
- Use deterministic ordering; define tie-breakers using public IDs only after confirming the query and index. Do not claim snapshot consistency without implementation support.
- Empty collections return an empty array and pagination metadata with `hasNext: false`.
- `totalCount` is required by offset metadata; cursor responses do not promise a total count.
- Filter syntax, sort allowlists, empty-page behavior, and per-operation page sizes remain open unless explicitly described in the owning contract. Missing details block implementation; do not infer performance or indexing guarantees.
