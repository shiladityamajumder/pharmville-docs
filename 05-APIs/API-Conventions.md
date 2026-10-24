# API conventions

**Contract status: Proposed for Pharmville unless directly identified as verified evidence.** No Pharmville HTTP server was found in the repository. The separately checked authentication service confirms its own response envelope only.

## Versioning and identifiers

Application routes use `/v1`. Public resource identifiers are UUIDs or opaque tokens; database BIGINT keys are internal and never authorization evidence. Route examples in this package describe intended contracts and do not establish deployed routes.

New public JSON DTOs use camelCase. Existing snake_case drafts are not silently redefined: if any external consumer already uses one, preserve its current version or plan an explicit versioned migration. Use UTC RFC 3339 timestamps, UUID strings for public UUID references, and money as a decimal string plus ISO 4217 currency unless an approved operation defines integer minor units.

## Request handling order

Authenticate the caller or verify the provider/service trust proof, authorize the action against the concrete resource and server-derived scope, validate the request DTO and approved master values, check the aggregate-specific version, execute the owning module's local transaction, persist required audit/outbox evidence with that transaction, and return a filtered read model.

Do not claim a cross-module atomic transaction unless its implementation is explicitly designed and evidenced.

## Headers

Use [Authentication and authorization](Authentication-and-Authorization.md) for header selection. `Idempotency-Key` is required for retries that could duplicate a state change, including checkout, payment, stock, refund, upload confirmation and delivery completion. `If-Match` is used only by an endpoint that explicitly declares an ETag precondition. `X-Request-Id` and `X-Correlation-Id` are tracing values, never identity credentials.

## Request and response schema policy

Each operation declares its content type, path/query/body contract, response status/headers and errors in its owning module page and in [OpenAPI](openapi.yaml). Proposed fields stay proposed until reviewed under D-024 and mapped to approved persistence. Unknown fields are rejected for command DTOs unless an operation documents an extension point.

Server-generated identity, actor, role, prices, approval state, stock availability and provider outcomes are not writable client fields.

Read [Standard responses](Standard-Responses.md), [Error catalog](Error-Catalog.md), [Pagination and filtering](Pagination-and-Filtering.md), [Idempotency and concurrency](Idempotency-and-Concurrency.md), and the [coverage ledger](API-Contract-Coverage.md) together. A contract can be complete for review while still blocked from implementation.
