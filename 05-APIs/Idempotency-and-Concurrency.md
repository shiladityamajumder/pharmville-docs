# Idempotency and concurrency

**Status: Proposed for Pharmville mutations; D-024 approval and database/runtime evidence required.** The database documentation includes platform idempotency, outbox and inbox entities, but that alone does not establish an implemented HTTP policy.

State-changing commands with material effects require `Idempotency-Key`. Scope the key to authenticated principal/service, operation and target aggregate. Store a canonical request fingerprint and the committed response/status for the retention period selected by D-024. Same key and same fingerprint replays the original result without a second business effect. Same key with different input returns `409 IDEMPOTENCY_KEY_CONFLICT`. A timeout after a possible commit is resolved by replay/query using the same key, never by creating a new command blindly.

Use an aggregate-specific positive `expectedVersion` in request DTOs or `If-Match` with a strong ETag. Do not require both unless a contract explains their separate scopes. A stale write returns `409 STALE_VERSION` for body versions or `412 PRECONDITION_FAILED` for HTTP preconditions. Reads that precede writes do not reserve stock or guarantee a later price, eligibility or assignment.

One owning module commits its local state and its audit/outbox evidence atomically where supported. Cross-module changes use durable commands/events and explicit pending states, not a claimed distributed ACID transaction. Provider timeouts leave state pending/unknown until verified callback or reconciliation. Compensation is a new auditable command, not an unlogged inverse write.
