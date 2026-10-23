# Development setup and operations

## Local Setup

## Local setup and developer environment

**Verified repo:** [database repository](../../healthcare_db/healthcare_db/README.md) is PostgreSQL SQL migrations plus Python/SQLAlchemy verification tools, not a runnable NestJS HTTP application. Build the web/API repos only after team approval of their structure.

**Database safe setup (repository-described, not run here):** use a dedicated empty PostgreSQL 15+ local database and direct `DATABASE_URL`, install `requirements.txt` for Python tooling, inspect `postgresql/docs/RELEASE_RUNBOOK.md`, then `postgresql/db status`, `postgresql/db migrate`, and `postgresql/db verify` (or the Windows `.ps1` equivalents). Do not run these against an existing Alembic-managed production database without a separately approved ledger adoption plan. The DB repository does not provision PostgreSQL.

**Application build (proposed):** separate Next.js customer and admin web apps, NestJS modular API, optional worker, and rider Android technology awaiting decision. Add typed env validation, isolated sandbox provider credentials, no secrets in Git, migration owner separate from runtime users.

**Pre-commit:** lint, unit tests, API DTO checks, migration history checksum diff, SQL catalog/ORM parity, and secret scan. Confirm target PostgreSQL minor-version behavior and permissions before integrating APIs.

## Configuration

## Environment and secrets configuration

Store separate configuration for approved provider account IDs, masked support contact, allowed origins, JWT/key rotation, Redis/BullMQ endpoints, database runtime role, storage bucket/KMS, serviceability, paid delivery, inventory freshness, COD/refund thresholds and scheduled task rates. A setting existing in DB does not mean its business value is approved.

Use Git-ignored local example files and AWS Secrets Manager for deployed credentials. Never put secrets, real customer data, bank/KYC scans or Rx bodies into commits, logs, issues, documentation or CI test artifacts. Deploy with immutable environment version tags and audited config changes. Sensitive values must be rotated and ownership verified independently.

Make unknown clinical/stock/payment policy fail closed, not default to a convenient number. System clocks should be timezone-aware and persistence timestamps unambiguous (UTC by convention after approval). See Decisions.

## Environments

## Environments and isolation

Use separately controlled dev, staging and production deployments. The master checklist selects AWS ap-south-1, a scaled-down staging topology and PostgreSQL RDS for production. The supplied repository's latest checks ran on isolated local PostgreSQL 18, not a shared production DB; hosted PG15/18 CI and production promotion are not confirmed by the evidence.

Development uses fake/synthetic patients, product/stock/licensing and provider credentials; never copy real Rx or legal identification. Staging reproduces runtime role/ACL/RLS, object-storage privacy, versioned SQL migrations and Cashfree/MSG91 provider sandbox behavior. Production needs owner-managed credentials, signed policies, backout/forward-fix and an approved restore plan.

Separate network/data permissions for API, worker, migration owner, reporting capability and encrypted file storage. Document DNS/certificate choice, environment secrets and actual service resource sizes after load validation. See Infrastructure and Config.

## Infrastructure

## AWS deployment component plan

Chosen direction: AWS Mumbai with containerized Next.js/NestJS services behind controlled ingress (Nginx selected), RDS PostgreSQL, private S3, Redis/ElastiCache where practical, GitHub Actions deployment and CloudWatch observability. The checklist gives initial instance families, but traffic/load evidence has not validated sizing or redundancy.

Run API and background BullMQ workers with separate IAM and connection pools. The SQL migration owner runs only an explicit release job; runtime uses restricted DB capability credentials. Protect Rx uploads, signed downloads, logs, SES/MSG91/Cashfree keys and stored location samples. Apply secure service ingress, HTTPS/TLS, health probes, rate limits, controlled network egress and cost budgets.

Availability zones, backups/PITR, WAF, TLS certificate supplier, scaling rules, actual RDS/PgBouncer need deployment review. See Master HLD.

## CI CD

## CI/CD checks and promotion stages

GitHub Actions is selected. The database repo already contains `.github/workflows/database-ci.yml` targeting PostgreSQL 15/18, Python 3.13, sealed migration verification, parity, tests and restore evidence. The final report confirms local PG18 checks but not independently observed hosted CI/PG15 completion; do not claim a green hosted run.

For the application repositories add build/lint/typecheck, unit/contract tests, NestJS OpenAPI drift detection, restricted-runtime integration tests, Next.js/rider UI tests, secret/SAST/dependency scanning and tagged deployment to staging. The migration stage must check checksums and existing-ledger provenance, take backups, apply only forward versions and verify catalog after deployment.

Promote to prod only with owner/pharmacist/finance signoff and tested provider sandbox integration, recovery, security and operating readiness. Use short-lived cloud credentials rather than static GitHub secrets where practical. See Migration.

## Deployment

## Safe deploy sequence

1. Obtain authorized environment and record existing SQL ledger/checksums without printing secrets.
2. Review forward SQL migration for locks, backfills and compatibility; rehearse on a disposable restoration of appropriate sample data.
3. Run repository `postgresql/db` or `db.ps1` commands as documented for `status`, `migrate`, `verify` using an approved connection; never run Alembic or reset production.
4. Deploy backward-compatible NestJS API/worker version, then protected staff/customer/rider clients once contracts pass.
5. Verify DB role grants/RLS, pharmacy/stock/payment gates, sandbox integration and operational dashboards.
6. Record result, build hash, migration ledger, API schema and authorized release owners.

A nonempty pre-Alembic managed DB needs a separate ledger-adoption plan; do not assume V0001 is safe on existing data. Any failure after real writes may need forward-fix or compensating business records rather than naive schema rollback. See Release Runbook.

## Backup and Recovery

## Backup, restore and disaster recovery

The master checklist states daily backups, 30-day retention, enabled point-in-time recovery, target RPO 15–30 min and RTO 1–2 h. These are decisions/targets, not evidence they have been attained on production. The DB repo includes a local synthetic ACL-preserving restore check across 266 tables, but real multi-zone RDS and encrypted S3/Rx recovery still need staging proof.

Run restore drills on an isolated environment: validate ledger/checksums, table/row totals, FK consistency, RLS roles/default privileges, grants, SQL function/trigger behavior, file object metadata, audit/history and ability to resume provider reconciliation. Ensure replay/outbox consumers do not double charge, refund or dispatch after restoration. Test external provider outage while recovered.

Record timestamp, RPO/RTO observed, loss window, approved business compensation and signoff. Never include sensitive production dump in CI artifacts. See Reliability.

## Logging

## Structured logs and data minimization

Include request ID, service/module, safe actor category, transaction ID, stage transition, state revision, provider correlation ID, duration and error classification. For Cashfree webhooks log signature-check result and opaque event ID but not payment details or raw request. For pharmacist and private file access log object reference and purpose but never Rx image, diagnosis or link token.

CloudWatch is selected in the checklist, with Sentry and OpenTelemetry/New Relic options. Export and warehouse activity can become sensitive at large volume; apply per-role dashboards and retention approved by security/legal. The checklist describes operational logging retention 14–30 days as a decision note; confirm exact policies per log class.

Use sampled traces for high-volume GPS, never unbounded storage of precise rider location. Logs cannot serve as substitutes for immutable financial and clinical audit tables. See Audit.

## Monitoring

## Operational monitoring and alerts

Instrument checkout conversion/price conflict, order-intent idempotency, P-line review age/correction rate, POS observation age, eligible stock hold denial, last-unit lock contention, Cashfree verified/pending/settlement lag, refund backlog, rider task/GPS quality, failed delivery and COD imbalance.

Also monitor PostgreSQL connection saturation, deadlocks, high-latency SQL, RLS denials, outbox/inbox lag, BullMQ retry/dead-letter backlog, S3 scan/fetch failures, p95 API latency and 5xx spikes. Alert routes require named operators, on-call coverage and clear escalation procedure; no staffing/on-call rota is proven in source files.

Choose SLOs and thresholds after real staging load; the HLD's indicative p95/99.9% suggestions are not measured guarantees. Critical safety blocks should page business operations only when actionable, not be retried as transient errors. See Operational Metrics.
