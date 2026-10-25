# Customer Accounts database contract

**Structure validated; business write assignment Proposed.** Profiles, addresses, family associations and consent; delegates credentials and sessions to Authentication. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | Transactional | D-024; SQL grants reviewed independently |
| [`customer.consent_events`](../../04-Database/Tables/customer/consent_events.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`customer.consents`](../../04-Database/Tables/customer/consents.md) | Transactional | D-024; SQL grants reviewed independently |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`customer.preferences`](../../04-Database/Tables/customer/preferences.md) | Configuration | D-024; SQL grants reviewed independently |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | Transactional | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | `id`, `is_deleted`, `row_version`, `status` | None | Product_Catalog | ACC-ROUTE-008, ACC-ROUTE-009 |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | `family_member_id` | Prescription_Upload | API-007, API-008, ACC-ROUTE-003, ACC-ROUTE-004 |
| [`commerce.checkouts`](../../04-Database/Tables/commerce/checkouts.md) | `address_id`, `expires_at`, `id`, `row_version`, `status`, `user_id` | None | Cart_Checkout | ACC-ROUTE-001, ACC-ROUTE-002 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | ACC-ROUTE-003, ACC-ROUTE-004 |
| [`compliance.legal_holds`](../../04-Database/Tables/compliance/legal_holds.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `status`, `updated_by` | None | Customer_Accounts via Privacy/Legal owner | ACC-ROUTE-007 |
| [`compliance.privacy_requests`](../../04-Database/Tables/compliance/privacy_requests.md) | `completed_at`, `created_by`, `due_at`, `id`, `request_number`, `request_type`, `requested_at`, `row_version`, `status`, `updated_by`, `user_id` | `due_at`, `request_number`, `request_type`, `requested_at`, `status`, `user_id` | Customer_Accounts via Privacy/Legal owner | ACC-ROUTE-007, ACC-ROUTE-006 |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | `city`, `country_code`, `district`, `id`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `row_version`, `state`, `state_code`, `user_id` | `city`, `country_code`, `deleted_at`, `deleted_by`, `district`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `state`, `state_code`, `user_id`, `validation_status` | Customer_Accounts | API-005, API-006, ACC-ROUTE-001, ACC-ROUTE-002 |
| [`customer.consent_events`](../../04-Database/Tables/customer/consent_events.md) | None | `actor_user_id`, `consent_id`, `event_type`, `metadata_json`, `request_id` | Customer_Accounts | API-009 |
| [`customer.consents`](../../04-Database/Tables/customer/consents.md) | `consent_type`, `expires_at`, `granted_at`, `id`, `purpose`, `row_version`, `source`, `status`, `user_id`, `version`, `withdrawn_at` | `consent_type`, `evidence`, `granted_at`, `purpose`, `source`, `status`, `user_id`, `version`, `withdrawn_at` | Customer_Accounts | API-009, ACC-ROUTE-005 |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | `customer_user_id`, `date_of_birth`, `gender`, `id`, `is_deleted`, `is_dependent`, `name`, `relationship`, `row_version` | `customer_user_id`, `date_of_birth`, `deleted_at`, `deleted_by`, `gender`, `is_deleted`, `is_dependent`, `name`, `relationship` | Customer_Accounts | API-007, API-008, ACC-ROUTE-003, ACC-ROUTE-004 |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | `created_by`, `date_of_birth`, `default_address_id`, `deleted_by`, `first_name`, `gender`, `id`, `is_deleted`, `last_name`, `preferred_name`, `row_version`, `updated_by`, `user_id` | `default_address_id`, `first_name`, `last_name`, `preferred_name` | Customer_Accounts | API-002, API-003, API-004, API-006, ACC-ROUTE-001, ACC-ROUTE-002 |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | `created_at`, `id`, `product_id`, `row_version`, `wishlist_id` | `id`, `product_id`, `row_version`, `wishlist_id` | Customer_Accounts | ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | `id`, `is_deleted`, `row_version`, `user_id` | `is_default`, `name`, `user_id` | Customer_Accounts | ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`identity.authentication_challenges`](../../04-Database/Tables/identity/authentication_challenges.md) | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `created_at`, `created_by`, `expires_at`, `factor_type`, `id`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by`, `user_id` | `attempts`, `binding_json`, `blocked_at`, `consumed_at`, `expires_at`, `factor_type`, `identifier_encrypted`, `identity_version`, `max_attempts`, `mfa_factor_id`, `otp_challenge_id`, `parent_challenge_id`, `policy_version`, `purpose`, `requested_context_hash`, `session_id`, `token_hash`, `user_id` | Authentication_Access | API-001, API-002 |
| [`identity.login_attempts`](../../04-Database/Tables/identity/login_attempts.md) | None | `failure_code`, `ip_address`, `login_identifier_hash`, `request_id`, `success`, `user_agent`, `user_id` | Authentication_Access | API-002 |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | `attempts`, `blocked_at`, `consumed_at`, `created_by`, `destination_hash`, `expires_at`, `id`, `otp_hash`, `purpose`, `row_version`, `updated_by` | `attempts`, `blocked_at`, `channel`, `consumed_at`, `destination_hash`, `expires_at`, `max_attempts`, `otp_hash`, `purpose` | Authentication_Access | API-001, API-002 |
| [`identity.permissions`](../../04-Database/Tables/identity/permissions.md) | `action`, `code`, `id`, `is_deleted`, `resource` | None | Authentication_Access | API-002 |
| [`identity.role_permissions`](../../04-Database/Tables/identity/role_permissions.md) | `permission_id`, `role_id`, `row_version` | None | Authentication_Access | API-002 |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `code`, `id`, `is_deleted`, `row_version` | None | Authentication_Access | API-002 |
| [`identity.session_refresh_tokens`](../../04-Database/Tables/identity/session_refresh_tokens.md) | `consumed_at`, `created_at`, `created_by`, `expires_at`, `id`, `parent_token_id`, `revoked_at`, `row_version`, `session_id`, `token_hash`, `updated_at`, `updated_by` | `consumed_at`, `expires_at`, `parent_token_id`, `revoked_at`, `session_id`, `token_hash` | Authentication_Access | API-002 |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | `active_assignment_id`, `active_workspace_code`, `authentication_policy_version`, `context_version`, `expires_at`, `id`, `mfa_verified_at`, `otp_verified_at`, `password_verified_at`, `refresh_token_hash`, `revoked_at`, `row_version`, `token_family_id`, `user_id` | `active_assignment_id`, `active_workspace_code`, `authenticated_at`, `authentication_policy_version`, `context_version`, `mfa_verified_at`, `otp_verified_at`, `password_verified_at` | Authentication_Access | API-002 |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `is_active`, `role_id`, `row_version`, `scope_id`, `scope_type`, `user_id`, `valid_from`, `valid_until` | None | Authentication_Access | API-002 |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `account_closed_at`, `created_by`, `email`, `email_verified_at`, `failed_login_count`, `id`, `locked_until`, `phone_country_code`, `phone_number`, `phone_verified_at`, `row_version`, `status`, `updated_by` | `email`, `email_normalized`, `email_verified_at`, `last_login_at`, `phone_country_code`, `phone_number`, `phone_verified_at`, `status` | Authentication_Access | API-001, API-002, API-003, API-004, ACC-ROUTE-007 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `id`, `is_active`, `is_deleted`, `location_type`, `organization_id` | None | Admin_CMS | API-002 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `location_id`, `organization_id`, `row_version`, `status`, `user_id` | None | Admin_CMS | API-002 |
| [`organization.organizations`](../../04-Database/Tables/organization/organizations.md) | `id`, `is_deleted`, `status` | None | Admin_CMS | API-002 |
| [`warehouse.warehouses`](../../04-Database/Tables/warehouse/warehouses.md) | `id`, `is_deleted`, `location_id`, `organization_id`, `status` | None | Warehouse | API-002 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`catalog.products`](../../04-Database/Tables/catalog/products.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
