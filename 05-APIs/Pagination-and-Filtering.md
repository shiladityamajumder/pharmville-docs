# Pagination and filtering

**Status: Proposed.** Existing repository guidance requires deterministic scope-aware cursors for volatile queues but does not establish that every current query has a supporting index.

Collection operations use an allowlisted filter/sort contract. Customer scope is derived from the credential. Store, warehouse, pharmacy, delivery, reporting and audit scopes are derived from server-side permissions and membership; caller scope values only narrow an authorized scope. Never accept SQL fragments or arbitrary sort fields.

Use cursor pagination for volatile or sensitive queues and histories. The cursor is opaque, integrity protected, tied to the authorized scope and sort tuple, and invalidated when its contract version changes. Stable ordering uses an immutable tie breaker (for example creation time plus public ID) only after the owning query and index are verified. Do not promise snapshot consistency unless the database implementation provides it. `meta.pagination` is `{ "nextCursor": "…", "hasNext": true }` for cursor APIs; offset APIs must use the authentication service's verified `{totalCount, limit, offset, hasNext}` shape. Select one per operation and do not mix cursor and offset tokens.

Limits, defaults, filters and sort allowlists are unresolved per operation unless explicitly stated in its owning contract. No undocumented numeric cap is inferred. Invalid filters return `422 VALIDATION_ERROR`; a cursor from a different principal/scope is rejected without revealing that scope's data.
