# Delivery database contract

**Structure validated; business write assignment Proposed.** Assignments, custody, attempts, OTP/location facts; rider is a scoped client and Finance owns COD money. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`logistics.carrier_accounts`](../../04-Database/Tables/logistics/carrier_accounts.md) | Configuration | D-024; SQL grants reviewed independently |
| [`logistics.carriers`](../../04-Database/Tables/logistics/carriers.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | Transactional | D-024; SQL grants reviewed independently |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`logistics.delivery_location_updates`](../../04-Database/Tables/logistics/delivery_location_updates.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`logistics.delivery_otp_challenges`](../../04-Database/Tables/logistics/delivery_otp_challenges.md) | Transactional | D-024; SQL grants reviewed independently |
| [`logistics.delivery_routes`](../../04-Database/Tables/logistics/delivery_routes.md) | Derived / Operational | D-024; SQL grants reviewed independently |
| [`logistics.delivery_slots`](../../04-Database/Tables/logistics/delivery_slots.md) | Derived / Operational | D-024; SQL grants reviewed independently |
| [`logistics.ndr_cases`](../../04-Database/Tables/logistics/ndr_cases.md) | Transactional | D-024; SQL grants reviewed independently |
| [`logistics.reverse_shipments`](../../04-Database/Tables/logistics/reverse_shipments.md) | Transactional | D-024; SQL grants reviewed independently |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | Transactional | D-024; SQL grants reviewed independently |
| [`logistics.serviceability_rules`](../../04-Database/Tables/logistics/serviceability_rules.md) | Configuration | D-024; SQL grants reviewed independently |
| [`logistics.shipment_events`](../../04-Database/Tables/logistics/shipment_events.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | Transactional | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-031 |
| [`fulfillment.packages`](../../04-Database/Tables/fulfillment/packages.md) | `id`, `row_version`, `status` | None | Store_Operations | API-064 |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | `created_by`, `deleted_by`, `id`, `is_deleted`, `row_version`, `updated_by` | None | Authentication_Access | API-068 |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | `id`, `is_active`, `row_version`, `user_id`, `valid_from`, `valid_until` | `is_active`, `role_id`, `scope_id`, `scope_type`, `user_id` | Authentication_Access | API-065, API-068 |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | `created_by`, `id`, `row_version`, `status`, `updated_by` | None | Authentication_Access | API-068 |
| [`logistics.delivery_assignments`](../../04-Database/Tables/logistics/delivery_assignments.md) | `accepted_at`, `assigned_at`, `delivery_user_id`, `ended_at`, `id`, `is_current`, `row_version`, `shipment_id`, `status` | `assigned_at`, `delivery_user_id`, `ended_at`, `is_current`, `shipment_id`, `status` | Delivery_Operations | API-064, API-065, API-066, API-067, API-069, API-070, API-072, API-074 |
| [`logistics.delivery_attempts`](../../04-Database/Tables/logistics/delivery_attempts.md) | `attempt_number`, `attempted_at`, `delivery_user_id`, `id`, `proof_file_id`, `proof_metadata`, `reason_code`, `reason_code_id`, `row_version`, `shipment_id`, `status` | `attempt_number`, `attempted_at`, `delivery_user_id`, `otp_verified`, `proof_file_id`, `proof_metadata`, `reason_code`, `shipment_id`, `status` | Delivery_Operations | API-066, API-074 |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | `id`, `is_active`, `row_version` | None | Delivery_Operations | API-066, API-074 |
| [`logistics.delivery_location_updates`](../../04-Database/Tables/logistics/delivery_location_updates.md) | None | `accuracy_m`, `assignment_id`, `delivery_user_id`, `latitude`, `longitude`, `received_at`, `recorded_at`, `shift_id`, `source` | Delivery_Operations | API-072 |
| [`logistics.ndr_cases`](../../04-Database/Tables/logistics/ndr_cases.md) | `id`, `next_action`, `next_attempt_at`, `reason_code`, `reason_code_id`, `resolved_at`, `row_version`, `shipment_id`, `status` | `next_action`, `next_attempt_at`, `reason_code`, `resolved_at`, `shipment_id`, `status` | Delivery_Operations | API-066, API-074 |
| [`logistics.rider_shifts`](../../04-Database/Tables/logistics/rider_shifts.md) | `ended_at`, `id`, `rider_user_id`, `started_at` | `ended_at`, `rider_user_id`, `started_at` | Delivery_Operations | API-065, API-069, API-070, API-072 |
| [`logistics.shipments`](../../04-Database/Tables/logistics/shipments.md) | `delivered_at`, `dispatched_at`, `estimated_delivery_at`, `id`, `order_id`, `order_revision_id`, `package_id`, `row_version`, `shipping_label_file_id`, `status` | `status` | Delivery_Operations | API-031, API-064, API-065, API-066, API-067, API-070, API-074 |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | `created_by`, `deleted_by`, `id`, `is_active`, `is_deleted`, `organization_id`, `row_version`, `updated_by` | None | Admin_CMS | API-068 |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | `created_by`, `id`, `location_id`, `manager_user_id`, `organization_id`, `row_version`, `status`, `updated_by`, `user_id` | `location_id`, `organization_id`, `status`, `user_id` | Admin_CMS | API-064, API-065, API-067, API-068 |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | `amount`, `collected_at`, `collected_by_user_id`, `deposited_at`, `id`, `order_id`, `order_revision_id`, `row_version`, `shipment_id`, `status` | None | Finance_Payments | API-067 |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | None | Shared platform file service — engineering owner; no clinical write grant | API-074 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`identity.roles`](../../04-Database/Tables/identity/roles.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.user_roles`](../../04-Database/Tables/identity/user_roles.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`identity.users`](../../04-Database/Tables/identity/users.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`logistics.delivery_failure_reasons`](../../04-Database/Tables/logistics/delivery_failure_reasons.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.locations`](../../04-Database/Tables/organization/locations.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`organization.memberships`](../../04-Database/Tables/organization/memberships.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
