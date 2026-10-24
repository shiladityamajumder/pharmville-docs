# Authentication database contract

**Structure validated; business write assignment Proposed.** Authentication mechanics and role grants; customer login endpoints retain their historical customer contract surface. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`identity.api_client_secrets`](../../04-Database/Tables/identity/api_client_secrets.md) | Configuration | D-024; SQL grants reviewed independently |
| [`identity.api_clients`](../../04-Database/Tables/identity/api_clients.md) | Configuration | D-024; SQL grants reviewed independently |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | Configuration | D-024; SQL grants reviewed independently |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | Transactional | D-024; SQL grants reviewed independently |
| [`identity.password_history`](../../04-Database/Tables/identity/password_history.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | Transactional | D-024; SQL grants reviewed independently |
| [`identity.trusted_devices`](../../04-Database/Tables/identity/trusted_devices.md) | Configuration | D-024; SQL grants reviewed independently |
| [`identity.user_profiles`](../../04-Database/Tables/identity/user_profiles.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Master / Reference | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by`, `user_id` | None | Customer_Accounts | API-002 |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `failure_code`, `ip_address`, `login_identifier_hash`, `request_id`, `success`, `user_agent`, `user_id` | Authentication_Access | API-089, API-090 |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | `created_by`, `id`, `row_version`, `updated_by`, `user_id` | None | Authentication_Access | API-089, API-090 |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | `attempts`, `blocked_at`, `consumed_at`, `created_by`, `destination_hash`, `expires_at`, `id`, `otp_hash`, `purpose`, `row_version`, `updated_by` | `attempts`, `blocked_at`, `channel`, `consumed_at`, `destination_hash`, `expires_at`, `max_attempts`, `otp_hash`, `purpose` | Authentication_Access | API-001, API-002 |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `action`, `code`, `id`, `is_deleted`, `resource`, `row_version` | None | Authentication_Access | API-093 |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `id`, `permission_id`, `role_id`, `row_version` | None | Authentication_Access | API-093 |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access | API-089, API-093 |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `created_by`, `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `updated_by`, `user_id` | `expires_at`, `last_seen_at`, `refresh_token_hash`, `revoke_reason`, `revoked_at`, `token_family_id`, `user_id` | Authentication_Access | API-002, API-090, API-091, API-092 |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `created_by`, `id`, `is_active`, `role_id`, `row_version`, `scope_id`, `scope_type`, `updated_by`, `user_id`, `valid_from`, `valid_until` | None | Authentication_Access | API-089, API-090, API-093 |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `email`, `id`, `phone_country_code`, `phone_number`, `row_version`, `status`, `updated_by` | `failed_login_count`, `last_login_at`, `locked_until`, `phone_country_code`, `phone_number`, `phone_verified_at`, `status` | Authentication_Access | API-001, API-002, API-089, API-090, API-091 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.mfa_factors`](../../04-Database/Tables/identity/mfa_factors.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
