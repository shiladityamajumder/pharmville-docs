# Release and incident handling

## Canary release plan — future activity

**Not deployed.** Begin with small approved test cohorts or staff pilots after signed UAT and database/provider readiness. Compare accepted checkout and order truth, money/stock reconciliation, clinical safety denials and user-visible API failures against the established baseline. Numeric traffic and time windows require SRE/product approval, not invented defaults.

Stop or roll back application traffic if mismatch, sensitive-data exposure, unsafe permission or pharmacy-review bypass is observed. Never delete clinical, audit or accounting records to reverse a failed canary.

## Feature flags and rollout controls

Flags are proposed for noncritical rollout features: search suggestions, alternative-product discovery, experimental CMS content, notification channels, or rider UI options. Store owner, expiry date, rollout rules, and rollback action with each flag. Do not use client-side flags as an authorization control or to bypass safety guards.

Unknown or stale flag evaluation should default to the approved safe behavior. Flag changes require audit events; cross-module features should use an explicit state-versioned rollout contract.

## Controlled iteration and change management

Create a change request with source approval, impact on REQ/FEAT, HLD/LLD, API DTOs, DB migration, security, acceptance tests, rollout and rollback. Do not silently adjust sensitive business rules through configuration or a migration.

Every approved change updates traceability IDs and affected documentation in the same review. Recheck compatibility of existing clients and replay queues after release.

## Production monitoring plan

**Proposed signals:** API latency and errors by module; DB pool saturation, deadlocks and slow queries; committed outbox backlog; payment unknown/duplicate outcome; licensed site stock staleness; denied clinical review; rider-proof discrepancy; backup recency, recovery drill age and privilege grants.

**Privacy:** logs and traces must not contain raw prescriptions, names, coordinates or payment secrets. Retain incident metadata in an approved restricted store with documented retention.

**Alert assignment:** propose operations owner for payment/stock, pharmacist for clinical review, and security lead for access/PII alerts. Actual staff and escalation contacts are not available.

## Release strategy — proposed

1. Lock approved Phase 1 scope and hard safety rules.
2. Produce immutable artifact builds and migration checksum review.
3. Deploy compatible API code and run external migration authority once via controlled job.
4. Execute database-backed concurrency, role-isolation, webhook replay, approved license/clinical and UAT scenarios in staging.
5. Enable noncritical customer-facing features gradually with feature flags where supported; never flag off pharmacy/legal/authorization guards.
6. Observe canary conversion **and** money/stock mismatch, clinical denials, request errors and privacy alerts.
7. Roll back application code only if database compatibility allows. Prefer forward SQL repair and controlled compensations once authoritative ledger writes have occurred.

**Status:** release procedure proposal, not proof a canary, staging environment or deployment exists.

## Controlled recovery and rollback

Freeze writes only under an approved incident action. For a bad application build, restore compatible code behind a feature flag; verify database ledger and provider state before replay. For already committed payments, refunds, stock movements or clinical decisions, prefer forward correction and compensating events with auditable reason codes rather than deleting records.

SQL history the checked-in SQL migration history is immutable in shared environments. A broken migration requires a reviewed forward-fix and restored snapshot only under DBA control. Record the decision owner, incident timestamp, business exposure, communication plan and evidence.

## Runbook — suspected production incident

**Trigger:** elevated 5xx, missing payments, stale inventory, unsafe P fulfillment, expired site license, private document exposure, GPS/OTP delivery discrepancy or unreconciled COD. Incident commander/roles require owner appointment before launch.

1. Identify affected module, sample correlation IDs and verified business facts without inspecting raw Rx/credential contents.
2. Freeze the unsafe path by feature flag or permission gate if possible; do not erase evidence or retry financial changes blindly.
3. Inspect authoritative PostgreSQL order/clinical/payment/stock state, signed gateway status, POS observation timestamps and release/change ledger.
4. Determine whether one accepted revision, refund, reservation or delivery record has already committed; dedupe any pending worker replay.
5. Inform appropriate pharmacy/finance/ops owner, preserve audit and privileged access evidence, and prepare an approved compensating action.
6. Restore service, verify safe gates, reconcile pending events and publish incident outcome with redacted records and follow-up test.

Related Runbook: Unknown Payment/Stock and Backup and Recovery.

## Runbook — payment or stock truth is unknown

**Payment:** A timeout, browser success screen or duplicated callback is not money truth. Query/verify Cashfree using the provider's approved signed/authorized adapter, correlate `payment_intents`, `payment_attempts`, `payment_webhooks` and `payment_transactions`, dedupe provider IDs and reconcile settlements. Do not initiate another charge automatically; leave order pending while operations resolve. Refund only after approved accounting policy and idempotency guard.

**Stock:** When Techsmith observation is stale or a lot/site/license is ineligible, block new holds and picks. Reconcile exact SKU/location/lot, stock ledger, shelf-life and accepted order revision with authorized store staff. Never fulfill from cached product page availability. On conflict, release or compensate old hold atomically and present customer consent path if the quote changes.

Record who approved the resolution and customer communication. A safe system may be temporarily unavailable; it must not silently dispense, charge or deliver based on guessed facts.
