# Development setup and operations

## Local setup and developer environment

**Canonical database:** [pharmville_schema.sql](../pharmville-database/pharmville_schema.sql) is the SQL-only effective structure. All historical source/history/local files are privately archived. [Installation](../04-Database/Installation.md) documents prerequisites, empty-schema setup, capability roles and seed exclusions.

**Verified isolated setup:** the source chain through V0030 and standalone SQL were installed only into newly initialized private PostgreSQL 18.6 databases. Their catalogs have zero structural differences; an additional independent cluster verified the SQL-only bootstrap and zero rows in all 266 tables. Reproduce with `python3 scripts/validate-database.py --fresh`. Earlier PostgreSQL releases are unverified. No existing database URL or `.env` is read by that validator.

For an existing populated environment, schema upgrade/adoption and backfill design require a separate reviewed release procedure. The standalone fresh-install file is not an upgrade script.

**Application build (proposed):** separate Next.js customer and admin web apps, NestJS modular API, optional worker, and rider Android technology awaiting decision. Add typed env validation, isolated sandbox provider credentials, no secrets in Git, schema installation owner separate from runtime users.

**Pre-commit:** lint, unit tests, API DTO checks, canonical SQL/catalog checksum diff, application data-access/catalog contract parity, and secret scan. Confirm target PostgreSQL minor-version behavior and permissions before integrating APIs.

## Environment and secrets configuration

Store separate configuration for approved provider account IDs, masked support contact, allowed origins, JWT/key rotation, Redis/BullMQ endpoints, database runtime role, storage bucket/KMS, serviceability, paid delivery, inventory freshness, COD/refund thresholds and scheduled task rates. A setting existing in DB does not mean its business value is approved.

Use Git-ignored local example files and AWS Secrets Manager for deployed credentials. Never put secrets, real customer data, bank/KYC scans or Rx bodies into commits, logs, issues, documentation or CI test artifacts. Deploy with immutable environment version tags and audited config changes. Sensitive values must be rotated and ownership verified independently.

Make unknown clinical/stock/payment policy fail closed, not default to a convenient number. System clocks should be timezone-aware and persistence timestamps unambiguous (UTC by convention after approval). See Decisions.

## Environments and isolation

Use separately controlled dev, staging and production deployments. The master checklist selects AWS ap-south-1, a scaled-down staging topology and PostgreSQL RDS for production. The supplied repository's latest checks ran on isolated local PostgreSQL 18, not a shared production DB; hosted PG15/18 CI and production promotion are not confirmed by the evidence.

Development uses fake/synthetic patients, product/stock/licensing and provider credentials; never copy real Rx or legal identification. Staging reproduces runtime role/ACL/RLS, object-storage privacy, the reviewed standalone schema and Cashfree/MSG91 provider sandbox behavior.

Production needs owner-managed credentials, signed policies, backout/forward-fix and an approved restore plan.

Separate network/data permissions for API, worker, schema installation owner, reporting capability and encrypted file storage. Document DNS/certificate choice, environment secrets and actual service resource sizes after load validation. See Infrastructure and Config.

## AWS deployment component plan

Chosen direction: AWS Mumbai with containerized Next.js/NestJS services behind controlled ingress (Nginx selected), RDS PostgreSQL, private S3, Redis/ElastiCache where practical, GitHub Actions deployment and CloudWatch observability. The checklist gives initial instance families, but traffic/load evidence has not validated sizing or redundancy.

Run API and background BullMQ workers with separate IAM and connection pools. The SQL schema installation owner runs only an explicit release job; runtime uses restricted DB capability credentials. Protect Rx uploads, signed downloads, logs, SES/MSG91/Cashfree keys and stored location samples.

Apply secure service ingress, HTTPS/TLS, health probes, rate limits, controlled network egress and cost budgets.

Availability zones, backups/PITR, WAF, TLS certificate supplier, scaling rules, actual RDS/PgBouncer need deployment review. See Master HLD.

## CI/CD checks and promotion stages

GitHub Actions is selected. The legacy database CI workflow is private historical evidence, not active tooling in the SQL-only deliverable. Current documentation checks cover links, Mermaid, OpenAPI/JSON examples, canonical catalog/table parity and protected wireframes. Fresh SQL installation is an explicit isolated PostgreSQL check. Hosted application/provider CI has not been observed or claimed.

For application repositories add build/lint/typecheck, meaningful unit/contract tests, NestJS OpenAPI drift detection, restricted-runtime integration/concurrency tests, Next.js/rider journeys, secret/SAST/dependency scanning and staging deployment. A separately approved populated-database release procedure must address compatibility, locks, backups, forward fixes and catalog verification; do not revive legacy runners by assumption.

Promote to prod only with owner/pharmacist/finance signoff and tested provider sandbox integration, recovery, security and operating readiness. Use short-lived cloud credentials rather than static GitHub secrets where practical. See Migration.

## Safe deploy sequence

1. Record the approved release target and verify SQL/catalog hashes without exposing credentials.
2. For a fresh empty database, follow the canonical installation prerequisites. For populated databases, require a separate reviewed upgrade/backfill procedure and isolated rehearsal.
3. Verify restricted capability roles, default privileges, RLS, domain guards and approved bootstrap datasets; application logins never use the installation identity.
4. Deploy a compatible API/worker and clients only after contract, business-owner and provider gates pass.
5. Verify pharmacy, stock, payment/COD, privacy and recovery behavior with actual execution evidence.
6. Record build/schema hashes, observed results and accountable release approvals.

No existing database or production environment was modified during this documentation rework.

## Backup, restore and disaster recovery

The master checklist states daily backups, 30-day retention, enabled point-in-time recovery, target RPO 15–30 min and RTO 1–2 h. These are decisions/targets, not evidence they have been attained on production. The archived DB source describes synthetic restore checks; this rework verified empty-schema restore/catalog parity, while real data/PITR and encrypted S3/Rx recovery still need staging proof.

Run restore drills on an isolated environment: validate approved schema/checksums, table/row totals, FK consistency, RLS roles/default privileges, grants, SQL function/trigger behavior, file object metadata, audit/history and ability to resume provider reconciliation. Ensure replay/outbox consumers do not double charge, refund or dispatch after restoration. Test external provider outage while recovered.

Record timestamp, RPO/RTO observed, loss window, approved business compensation and signoff. Never include sensitive production dump in CI artifacts. See Reliability.

## Structured logs and data minimization

Include request ID, service/module, safe actor category, transaction ID, stage transition, state revision, provider correlation ID, duration and error classification. For Cashfree webhooks log signature-check result and opaque event ID but not payment details or raw request.

For pharmacist and private file access log object reference and purpose but never Rx image, diagnosis or link token.

CloudWatch is selected in the checklist, with Sentry and OpenTelemetry/New Relic options. Export and warehouse activity can become sensitive at large volume; apply per-role dashboards and retention approved by security/legal. The checklist describes operational logging retention 14–30 days as a decision note; confirm exact policies per log class.

Use sampled traces for high-volume GPS, never unbounded storage of precise rider location. Logs cannot serve as substitutes for immutable financial and clinical audit tables. See Audit.

## Operational monitoring and alerts

Instrument checkout conversion/price conflict, order-intent idempotency, P-line review age/correction rate, POS observation age, eligible stock hold denial, last-unit lock contention, Cashfree verified/pending/settlement lag, refund backlog, rider task/GPS quality, failed delivery and COD imbalance.

Also monitor PostgreSQL connection saturation, deadlocks, high-latency SQL, RLS denials, outbox/inbox lag, BullMQ retry/dead-letter backlog, S3 scan/fetch failures, p95 API latency and 5xx spikes. Alert routes require named operators, on-call coverage and clear escalation procedure; no staffing/on-call rota is proven in source files.

Choose SLOs and thresholds after real staging load; the HLD's indicative p95/99.9% suggestions are not measured guarantees. Critical safety blocks should page business operations only when actionable, not be retried as transient errors. See Operational Metrics.
