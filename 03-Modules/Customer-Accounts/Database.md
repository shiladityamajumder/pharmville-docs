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
| [`clinical.patient_profiles`](../../04-Database/Tables/clinical/patient_profiles.md) | `family_member_id`, `id`, `is_deleted`, `row_version`, `user_id` | `family_member_id` | Prescription_Upload | ACC-ROUTE-003, ACC-ROUTE-004, API-007, API-008 |
| [`commerce.checkouts`](../../04-Database/Tables/commerce/checkouts.md) | `address_id`, `expires_at`, `id`, `row_version`, `status`, `user_id` | None | Cart_Checkout | ACC-ROUTE-001, ACC-ROUTE-002 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | ACC-ROUTE-003, ACC-ROUTE-004 |
| [`compliance.legal_holds`](../../04-Database/Tables/compliance/legal_holds.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `status`, `updated_by` | None | Customer_Accounts via Privacy/Legal owner | ACC-ROUTE-007 |
| [`compliance.privacy_requests`](../../04-Database/Tables/compliance/privacy_requests.md) | `completed_at`, `created_by`, `due_at`, `id`, `request_number`, `request_type`, `requested_at`, `row_version`, `status`, `updated_by`, `user_id` | `due_at`, `request_number`, `request_type`, `requested_at`, `status`, `user_id` | Customer_Accounts via Privacy/Legal owner | ACC-ROUTE-006, ACC-ROUTE-007 |
| [`customer.addresses`](../../04-Database/Tables/customer/addresses.md) | `city`, `country_code`, `district`, `id`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `row_version`, `state`, `state_code`, `user_id` | `city`, `country_code`, `deleted_at`, `deleted_by`, `district`, `is_default`, `is_deleted`, `label`, `latitude`, `line1`, `line2`, `locality`, `longitude`, `postal_code`, `recipient_name`, `recipient_phone`, `state`, `state_code`, `user_id`, `validation_status` | Customer_Accounts | ACC-ROUTE-001, ACC-ROUTE-002, API-005, API-006 |
| [`customer.consent_events`](../../04-Database/Tables/customer/consent_events.md) | None | `actor_user_id`, `consent_id`, `event_type`, `metadata_json`, `request_id` | Customer_Accounts | API-009 |
| [`customer.consents`](../../04-Database/Tables/customer/consents.md) | `consent_type`, `expires_at`, `granted_at`, `id`, `purpose`, `row_version`, `source`, `status`, `user_id`, `version`, `withdrawn_at` | `consent_type`, `evidence`, `granted_at`, `purpose`, `source`, `status`, `user_id`, `version`, `withdrawn_at` | Customer_Accounts | ACC-ROUTE-005, API-009 |
| [`customer.family_members`](../../04-Database/Tables/customer/family_members.md) | `customer_user_id`, `date_of_birth`, `gender`, `id`, `is_deleted`, `is_dependent`, `name`, `relationship`, `row_version` | `customer_user_id`, `date_of_birth`, `deleted_at`, `deleted_by`, `gender`, `is_deleted`, `is_dependent`, `name`, `relationship` | Customer_Accounts | ACC-ROUTE-003, ACC-ROUTE-004, API-007, API-008 |
| [`customer.profiles`](../../04-Database/Tables/customer/profiles.md) | `created_by`, `date_of_birth`, `default_address_id`, `deleted_by`, `first_name`, `gender`, `id`, `is_deleted`, `last_name`, `preferred_name`, `row_version`, `updated_by`, `user_id` | `default_address_id`, `first_name`, `last_name`, `preferred_name` | Customer_Accounts | ACC-ROUTE-001, ACC-ROUTE-002, API-002, API-003, API-004, API-006 |
| [`customer.wishlist_items`](../../04-Database/Tables/customer/wishlist_items.md) | `created_at`, `id`, `product_id`, `row_version`, `wishlist_id` | `id`, `product_id`, `row_version`, `wishlist_id` | Customer_Accounts | ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`customer.wishlists`](../../04-Database/Tables/customer/wishlists.md) | `id`, `is_deleted`, `row_version`, `user_id` | `is_default`, `name`, `user_id` | Customer_Accounts | ACC-ROUTE-008, ACC-ROUTE-009, ACC-ROUTE-010 |
| [`identity.otp_challenges`](../../04-Database/Tables/identity/otp_challenges.md) | `attempts`, `blocked_at`, `consumed_at`, `created_by`, `destination_hash`, `expires_at`, `id`, `otp_hash`, `purpose`, `row_version`, `updated_by` | `attempts`, `blocked_at`, `channel`, `consumed_at`, `destination_hash`, `expires_at`, `max_attempts`, `otp_hash`, `purpose` | Authentication_Access | API-001, API-002 |
| [`identity.sessions`](../../04-Database/Tables/identity/sessions.md) | None | `expires_at`, `refresh_token_hash`, `token_family_id`, `user_id` | Authentication_Access | API-002 |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `email`, `id`, `phone_country_code`, `phone_number`, `row_version`, `status`, `updated_by` | `email`, `email_normalized`, `email_verified_at`, `last_login_at`, `phone_country_code`, `phone_number`, `phone_verified_at`, `status` | Authentication_Access | ACC-ROUTE-007, API-001, API-002, API-003, API-004 |

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
