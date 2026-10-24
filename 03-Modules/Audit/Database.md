# Audit database contract

**Structure validated; business write assignment Proposed.** Append-only evidence infrastructure and authorized audit reads; business domains own command effects. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | Audit / History | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`platform.audit_logs`](../../04-Database/Tables/platform/audit_logs.md) | `action`, `actor_type`, `id`, `occurred_at`, `request_id`, `resource_id`, `resource_type` | None | Audit | API-087, API-088 |
| [`platform.report_definitions`](../../04-Database/Tables/platform/report_definitions.md) | `code`, `id`, `is_active` | None | Reporting | API-088 |
| [`platform.report_runs`](../../04-Database/Tables/platform/report_runs.md) | None | `definition_id`, `parameters`, `requested_at`, `requested_by_user_id`, `status` | Reporting | API-088 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`platform.report_definitions`](../../04-Database/Tables/platform/report_definitions.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
