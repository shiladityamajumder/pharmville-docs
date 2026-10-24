# Admin database contract

**Structure validated; business write assignment Proposed.** CMS/settings and operating organization/location management; domain owners retain controlled master semantics. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`organization.bank_accounts`](../../04-Database/Tables/organization/bank_accounts.md) | Configuration | D-024; SQL grants reviewed independently |
| [`organization.departments`](../../04-Database/Tables/organization/departments.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`organization.licenses`](../../04-Database/Tables/organization/licenses.md) | Transactional | D-024; SQL grants reviewed independently |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | Configuration | D-024; SQL grants reviewed independently |
| [`platform.cms_banners`](../../04-Database/Tables/platform/cms_banners.md) | Configuration | D-024; SQL grants reviewed independently |
| [`platform.cms_page_versions`](../../04-Database/Tables/platform/cms_page_versions.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`platform.cms_pages`](../../04-Database/Tables/platform/cms_pages.md) | Configuration | D-024; SQL grants reviewed independently |
| [`platform.data_retention_policies`](../../04-Database/Tables/platform/data_retention_policies.md) | Configuration | D-024; SQL grants reviewed independently |
| [`platform.feature_flags`](../../04-Database/Tables/platform/feature_flags.md) | Configuration | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | None | Pharmacist_Review | API-032 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-032 |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access | API-033 |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access | API-033, API-034 |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `created_by`, `expires_at`, `id`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `updated_by`, `user_id` | `revoke_reason`, `revoked_at` | Authentication_Access | API-034 |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `created_by`, `id`, `is_active`, `role_id`, `row_version`, `updated_by`, `user_id`, `valid_from`, `valid_until` | `is_active`, `role_id`, `scope_id`, `scope_type`, `user_id`, `valid_until` | Authentication_Access | API-033, API-034 |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `email`, `id`, `row_version`, `status`, `updated_by` | `email`, `email_normalized`, `status` | Authentication_Access | API-033, API-034 |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | `accepted_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | None | Delivery_Operations | API-032 |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | None | Delivery_Operations | API-032 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `address_json`, `code`, `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `location_type`, `name`, `organization_id`, `postal_code`, `row_version`, `timezone`, `updated_by` | `address_json`, `code`, `geo_metadata`, `is_active`, `location_type`, `name`, `organization_id`, `postal_code`, `timezone` | Admin_CMS | API-033, API-034, API-038 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | `left_at`, `location_id`, `organization_id`, `status`, `user_id` | Admin_CMS | API-033, API-034 |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `is_deleted`, `row_version`, `status` | None | Admin_CMS | API-038 |
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | `id`, `is_deleted`, `key`, `namespace`, `row_version`, `value` | `value` | Admin_CMS | API-035, API-036 |
| [`platform.cms_page_versions`](../../04-Database/Tables/platform/cms_page_versions.md) | `id`, `page_id` | `published_at` | Admin_CMS | API-037 |
| [`platform.cms_pages`](../../04-Database/Tables/platform/cms_pages.md) | `id`, `is_deleted`, `row_version`, `slug`, `status` | `status`, `updated_by_user_id` | Admin_CMS | API-037 |
| [`warehouse.stock_balances`](../../04-Database/Tables/warehouse/stock_balances.md) | `damaged_qty`, `id`, `inventory_observed_at`, `inventory_source`, `on_hand_qty`, `quarantined_qty`, `reserved_qty`, `row_version`, `warehouse_id` | None | Inventory | API-032 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.application_settings`](../../04-Database/Tables/platform/application_settings.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.cms_pages`](../../04-Database/Tables/platform/cms_pages.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
