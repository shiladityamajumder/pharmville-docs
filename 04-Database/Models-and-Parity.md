# ORM models and parity

## Model inventory

## Complete ORM class-to-table inventory

**Recorded model inventory:** 266 table-declaring SQLAlchemy classes across model modules; every registered class resolves to one of the 266 PostgreSQL tables in the recorded catalog, including six reason-code masters whose schema is supplied by `master_args(...)`.

**Scope of this check:** class-to-table naming and schema, **not** runtime column/type/nullability equality. The DB repository reports a separate zero-difference PG18 ORM/catalog parity run, which was not rerun here. No TypeScript model or NestJS data-access layer was supplied.

| PostgreSQL schema | ORM classes | Full class register |
| --- | --- | --- |
| `appointment` | 9 | Open |
| `catalog` | 19 | Open |
| `clinical` | 17 | Open |
| `commerce` | 17 | Open |
| `compliance` | 8 | Open |
| `customer` | 8 | Open |
| `diagnostics` | 13 | Open |
| `finance` | 8 | Open |
| `fulfillment` | 10 | Open |
| `identity` | 14 | Open |
| `insurance` | 8 | Open |
| `logistics` | 15 | Open |
| `marketplace` | 7 | Open |
| `membership` | 6 | Open |
| `notification` | 10 | Open |
| `organization` | 6 | Open |
| `payment` | 13 | Open |
| `platform` | 21 | Open |
| `pricing` | 8 | Open |
| `procurement` | 13 | Open |
| `risk` | 5 | Open |
| `search` | 5 | Open |
| `support` | 8 | Open |
| `warehouse` | 18 | Open |

**Source:** [database models](../../healthcare_db/healthcare_db/app/models/) (static parsing), `docs/upgrade/final_inventory.json` (recorded PG18 catalog).
**Caution:** imports, SQLAlchemy metadata construction, live ORM-column parity and PostgreSQL migrations were not executed during this documentation task. For planned NestJS runtime, establish a separate typed SQL access layer and verify its permissions.

## appointment

## SQLAlchemy models for `appointment`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `AppointmentSlots` | `app/models/appointment.py:124` | `appointment.appointment_slots` | all columns |
| `AppointmentStatusHistory` | `app/models/appointment.py:186` | `appointment.appointment_status_history` | all columns |
| `Appointments` | `app/models/appointment.py:146` | `appointment.appointments` | all columns |
| `AvailabilityExceptions` | `app/models/appointment.py:106` | `appointment.availability_exceptions` | all columns |
| `AvailabilityRules` | `app/models/appointment.py:85` | `appointment.availability_rules` | all columns |
| `PractitionerServices` | `app/models/appointment.py:52` | `appointment.practitioner_services` | all columns |
| `ServiceTypes` | `app/models/appointment.py:30` | `appointment.service_types` | all columns |
| `TeleconsultationSessions` | `app/models/appointment.py:203` | `appointment.teleconsultation_sessions` | all columns |
| `WaitingRoomEvents` | `app/models/appointment.py:225` | `appointment.waiting_room_events` | all columns |

## catalog

## SQLAlchemy models for `catalog`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `Brands` | `app/models/catalog.py:32` | `catalog.brands` | all columns |
| `Categories` | `app/models/catalog.py:85` | `catalog.categories` | all columns |
| `CommerceClasses` | `app/models/reference_data.py:54` | `catalog.commerce_classes` | all columns |
| `DosageForms` | `app/models/catalog.py:134` | `catalog.dosage_forms` | all columns |
| `Manufacturers` | `app/models/catalog.py:62` | `catalog.manufacturers` | all columns |
| `ProductAttributes` | `app/models/catalog.py:317` | `catalog.product_attributes` | all columns |
| `ProductClassificationHistory` | `app/models/pharmville.py:49` | `catalog.product_classification_history` | all columns |
| `ProductContent` | `app/models/catalog.py:434` | `catalog.product_content` | all columns |
| `ProductIdentifiers` | `app/models/catalog.py:273` | `catalog.product_identifiers` | all columns |
| `ProductMedia` | `app/models/catalog.py:334` | `catalog.product_media` | all columns |
| `ProductRegulatory` | `app/models/catalog.py:395` | `catalog.product_regulatory` | all columns |
| `ProductRelationships` | `app/models/catalog.py:369` | `catalog.product_relationships` | all columns |
| `ProductSalts` | `app/models/catalog.py:297` | `catalog.product_salts` | all columns |
| `ProductVariants` | `app/models/catalog.py:243` | `catalog.product_variants` | all columns |
| `Products` | `app/models/catalog.py:172` | `catalog.products` | all columns |
| `Salts` | `app/models/catalog.py:115` | `catalog.salts` | all columns |
| `SubstitutionGroupProducts` | `app/models/catalog.py:469` | `catalog.substitution_group_products` | all columns |
| `SubstitutionGroups` | `app/models/catalog.py:454` | `catalog.substitution_groups` | all columns |
| `UnitsOfMeasure` | `app/models/catalog.py:152` | `catalog.units_of_measure` | all columns |

## clinical

## SQLAlchemy models for `clinical`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `CareEpisodes` | `app/models/clinical.py:201` | `clinical.care_episodes` | all columns |
| `Consultations` | `app/models/clinical.py:219` | `clinical.consultations` | all columns |
| `Diagnoses` | `app/models/clinical.py:256` | `clinical.diagnoses` | all columns |
| `Observations` | `app/models/clinical.py:274` | `clinical.observations` | all columns |
| `OrderReviewItems` | `app/models/pharmville.py:161` | `clinical.order_review_items` | all columns |
| `OrderReviews` | `app/models/pharmville.py:80` | `clinical.order_reviews` | all columns |
| `PatientAllergies` | `app/models/clinical.py:137` | `clinical.patient_allergies` | all columns |
| `PatientConditions` | `app/models/clinical.py:156` | `clinical.patient_conditions` | all columns |
| `PatientMedications` | `app/models/clinical.py:175` | `clinical.patient_medications` | all columns |
| `PatientProfiles` | `app/models/clinical.py:98` | `clinical.patient_profiles` | all columns |
| `PractitionerOrganizations` | `app/models/clinical.py:71` | `clinical.practitioner_organizations` | all columns |
| `PractitionerProfiles` | `app/models/clinical.py:31` | `clinical.practitioner_profiles` | all columns |
| `PrescriptionAccessLogs` | `app/models/clinical.py:394` | `clinical.prescription_access_logs` | all columns |
| `PrescriptionDocuments` | `app/models/clinical.py:342` | `clinical.prescription_documents` | all columns |
| `PrescriptionItems` | `app/models/clinical.py:366` | `clinical.prescription_items` | all columns |
| `Prescriptions` | `app/models/clinical.py:298` | `clinical.prescriptions` | all columns |
| `ReviewReasonCodes` | `app/models/reference_data.py:70` | `clinical.review_reason_codes` | all columns |

## commerce

## SQLAlchemy models for `commerce`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `CancellationItems` | `app/models/commerce.py:353` | `commerce.cancellation_items` | all columns |
| `CancellationReasonCodes` | `app/models/reference_data.py:75` | `commerce.cancellation_reason_codes` | all columns |
| `Cancellations` | `app/models/commerce.py:330` | `commerce.cancellations` | all columns |
| `CartItems` | `app/models/commerce.py:57` | `commerce.cart_items` | all columns |
| `Carts` | `app/models/commerce.py:32` | `commerce.carts` | all columns |
| `Checkouts` | `app/models/commerce.py:90` | `commerce.checkouts` | all columns |
| `OrderAllocations` | `app/models/commerce.py:302` | `commerce.order_allocations` | all columns |
| `OrderCharges` | `app/models/commerce.py:241` | `commerce.order_charges` | all columns |
| `OrderDiscounts` | `app/models/commerce.py:259` | `commerce.order_discounts` | all columns |
| `OrderGroups` | `app/models/commerce.py:166` | `commerce.order_groups` | all columns |
| `OrderItems` | `app/models/commerce.py:191` | `commerce.order_items` | all columns |
| `OrderRevisions` | `app/models/pharmville.py:217` | `commerce.order_revisions` | all columns |
| `OrderStatusHistory` | `app/models/commerce.py:281` | `commerce.order_status_history` | all columns |
| `Orders` | `app/models/commerce.py:121` | `commerce.orders` | all columns |
| `ReturnItems` | `app/models/commerce.py:393` | `commerce.return_items` | all columns |
| `ReturnReasonCodes` | `app/models/reference_data.py:80` | `commerce.return_reason_codes` | all columns |
| `Returns` | `app/models/commerce.py:370` | `commerce.returns` | all columns |

## compliance

## SQLAlchemy models for `compliance`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `AdverseEventReports` | `app/models/compliance.py:111` | `compliance.adverse_event_reports` | all columns |
| `ComplianceEvidence` | `app/models/compliance.py:176` | `compliance.evidence` | all columns |
| `LegalHolds` | `app/models/compliance.py:160` | `compliance.legal_holds` | all columns |
| `PrivacyRequests` | `app/models/compliance.py:140` | `compliance.privacy_requests` | all columns |
| `ProductRecalls` | `app/models/compliance.py:70` | `compliance.product_recalls` | all columns |
| `RecallLots` | `app/models/compliance.py:93` | `compliance.recall_lots` | all columns |
| `RegulatoryAuthorities` | `app/models/compliance.py:26` | `compliance.regulatory_authorities` | all columns |
| `RegulatoryRegistrations` | `app/models/compliance.py:39` | `compliance.regulatory_registrations` | all columns |

## customer

## SQLAlchemy models for `customer`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `Addresses` | `app/models/customer.py:86` | `customer.addresses` | all columns |
| `ConsentEvents` | `app/models/customer.py:159` | `customer.consent_events` | all columns |
| `Consents` | `app/models/customer.py:128` | `customer.consents` | all columns |
| `FamilyMembers` | `app/models/customer.py:58` | `customer.family_members` | all columns |
| `Preferences` | `app/models/customer.py:177` | `customer.preferences` | all columns |
| `Profiles` | `app/models/customer.py:30` | `customer.profiles` | all columns |
| `WishlistItems` | `app/models/customer.py:225` | `customer.wishlist_items` | all columns |
| `Wishlists` | `app/models/customer.py:205` | `customer.wishlists` | all columns |

## diagnostics

## SQLAlchemy models for `diagnostics`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `DiagnosticOrderItems` | `app/models/diagnostics.py:200` | `diagnostics.diagnostic_order_items` | all columns |
| `DiagnosticOrders` | `app/models/diagnostics.py:159` | `diagnostics.diagnostic_orders` | all columns |
| `DiagnosticReports` | `app/models/diagnostics.py:293` | `diagnostics.diagnostic_reports` | all columns |
| `DiagnosticResultValues` | `app/models/diagnostics.py:317` | `diagnostics.diagnostic_result_values` | all columns |
| `LabLocations` | `app/models/diagnostics.py:51` | `diagnostics.lab_locations` | all columns |
| `LabOfferings` | `app/models/diagnostics.py:130` | `diagnostics.lab_offerings` | all columns |
| `LabProviders` | `app/models/diagnostics.py:29` | `diagnostics.lab_providers` | all columns |
| `SampleCollections` | `app/models/diagnostics.py:229` | `diagnostics.sample_collections` | all columns |
| `SampleEvents` | `app/models/diagnostics.py:275` | `diagnostics.sample_events` | all columns |
| `Samples` | `app/models/diagnostics.py:250` | `diagnostics.samples` | all columns |
| `TestDefinitions` | `app/models/diagnostics.py:70` | `diagnostics.test_definitions` | all columns |
| `TestPackageItems` | `app/models/diagnostics.py:114` | `diagnostics.test_package_items` | all columns |
| `TestPackages` | `app/models/diagnostics.py:96` | `diagnostics.test_packages` | all columns |

## finance

## SQLAlchemy models for `finance`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `Accounts` | `app/models/finance.py:25` | `finance.accounts` | all columns |
| `CreditNotes` | `app/models/finance.py:105` | `finance.credit_notes` | all columns |
| `InvoiceItems` | `app/models/finance.py:78` | `finance.invoice_items` | all columns |
| `Invoices` | `app/models/finance.py:43` | `finance.invoices` | all columns |
| `JournalEntries` | `app/models/finance.py:130` | `finance.journal_entries` | all columns |
| `JournalLines` | `app/models/finance.py:151` | `finance.journal_lines` | all columns |
| `SettlementItems` | `app/models/finance.py:198` | `finance.settlement_items` | all columns |
| `SettlementRuns` | `app/models/finance.py:172` | `finance.settlement_runs` | all columns |

## fulfillment

## SQLAlchemy models for `fulfillment`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `FulfillmentEvents` | `app/models/fulfillment.py:229` | `fulfillment.fulfillment_events` | all columns |
| `FulfillmentOrderItems` | `app/models/fulfillment.py:55` | `fulfillment.fulfillment_order_items` | all columns |
| `FulfillmentOrders` | `app/models/fulfillment.py:25` | `fulfillment.fulfillment_orders` | all columns |
| `PackTasks` | `app/models/fulfillment.py:159` | `fulfillment.pack_tasks` | all columns |
| `PackageItems` | `app/models/fulfillment.py:207` | `fulfillment.package_items` | all columns |
| `Packages` | `app/models/fulfillment.py:178` | `fulfillment.packages` | all columns |
| `PickTaskItems` | `app/models/fulfillment.py:131` | `fulfillment.pick_task_items` | all columns |
| `PickTasks` | `app/models/fulfillment.py:109` | `fulfillment.pick_tasks` | all columns |
| `PickingWaveOrders` | `app/models/fulfillment.py:94` | `fulfillment.picking_wave_orders` | all columns |
| `PickingWaves` | `app/models/fulfillment.py:76` | `fulfillment.picking_waves` | all columns |

## identity

## SQLAlchemy models for `identity`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `ApiClientSecrets` | `app/models/identity.py:715` | `identity.api_client_secrets` | all columns |
| `ApiClients` | `app/models/identity.py:668` | `identity.api_clients` | all columns |
| `LoginAttempts` | `app/models/identity.py:598` | `identity.login_attempts` | all columns |
| `MfaFactors` | `app/models/identity.py:510` | `identity.mfa_factors` | all columns |
| `OtpChallenges` | `app/models/identity.py:445` | `identity.otp_challenges` | all columns |
| `PasswordHistory` | `app/models/identity.py:643` | `identity.password_history` | all columns |
| `Permissions` | `app/models/identity.py:242` | `identity.permissions` | all columns |
| `RolePermissions` | `app/models/identity.py:343` | `identity.role_permissions` | all columns |
| `Roles` | `app/models/identity.py:212` | `identity.roles` | all columns |
| `Sessions` | `app/models/identity.py:376` | `identity.sessions` | all columns |
| `TrustedDevices` | `app/models/identity.py:557` | `identity.trusted_devices` | all columns |
| `UserProfiles` | `app/models/identity.py:142` | `identity.user_profiles` | all columns |
| `UserRoles` | `app/models/identity.py:276` | `identity.user_roles` | all columns |
| `Users` | `app/models/identity.py:30` | `identity.users` | all columns |

## insurance

## SQLAlchemy models for `insurance`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `ClaimDocuments` | `app/models/insurance.py:166` | `insurance.claim_documents` | all columns |
| `ClaimStatusHistory` | `app/models/insurance.py:186` | `insurance.claim_status_history` | all columns |
| `Claims` | `app/models/insurance.py:134` | `insurance.claims` | all columns |
| `EligibilityChecks` | `app/models/insurance.py:116` | `insurance.eligibility_checks` | all columns |
| `Insurers` | `app/models/insurance.py:29` | `insurance.insurers` | all columns |
| `InsurancePolicies` | `app/models/insurance.py:64` | `insurance.policies` | all columns |
| `PolicyMembers` | `app/models/insurance.py:97` | `insurance.policy_members` | all columns |
| `Tpas` | `app/models/insurance.py:49` | `insurance.tpas` | all columns |

## logistics

## SQLAlchemy models for `logistics`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `CarrierAccounts` | `app/models/logistics.py:49` | `logistics.carrier_accounts` | all columns |
| `Carriers` | `app/models/logistics.py:32` | `logistics.carriers` | all columns |
| `DeliveryAssignments` | `app/models/logistics.py:204` | `logistics.delivery_assignments` | all columns |
| `DeliveryAttempts` | `app/models/logistics.py:235` | `logistics.delivery_attempts` | all columns |
| `DeliveryFailureReasons` | `app/models/reference_data.py:85` | `logistics.delivery_failure_reasons` | all columns |
| `DeliveryLocationUpdates` | `app/models/pharmville.py:298` | `logistics.delivery_location_updates` | all columns |
| `DeliveryOTPChallenges` | `app/models/pharmville.py:327` | `logistics.delivery_otp_challenges` | all columns |
| `DeliveryRoutes` | `app/models/logistics.py:182` | `logistics.delivery_routes` | all columns |
| `DeliverySlots` | `app/models/logistics.py:90` | `logistics.delivery_slots` | all columns |
| `NdrCases` | `app/models/logistics.py:262` | `logistics.ndr_cases` | all columns |
| `ReverseShipments` | `app/models/logistics.py:281` | `logistics.reverse_shipments` | all columns |
| `RiderShifts` | `app/models/reference_data.py:100` | `logistics.rider_shifts` | all columns |
| `ServiceabilityRules` | `app/models/logistics.py:66` | `logistics.serviceability_rules` | all columns |
| `ShipmentEvents` | `app/models/logistics.py:158` | `logistics.shipment_events` | all columns |
| `Shipments` | `app/models/logistics.py:114` | `logistics.shipments` | all columns |

## marketplace

## SQLAlchemy models for `marketplace`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `CommissionPlans` | `app/models/marketplace.py:100` | `marketplace.commission_plans` | all columns |
| `SellerCommissionAssignments` | `app/models/marketplace.py:116` | `marketplace.seller_commission_assignments` | all columns |
| `SellerLocations` | `app/models/marketplace.py:53` | `marketplace.seller_locations` | all columns |
| `SellerProductListings` | `app/models/marketplace.py:74` | `marketplace.seller_product_listings` | all columns |
| `SellerRatings` | `app/models/marketplace.py:134` | `marketplace.seller_ratings` | all columns |
| `SellerServiceLevels` | `app/models/marketplace.py:154` | `marketplace.seller_service_levels` | all columns |
| `Sellers` | `app/models/marketplace.py:29` | `marketplace.sellers` | all columns |

## membership

## SQLAlchemy models for `membership`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `BenefitUsage` | `app/models/membership.py:94` | `membership.benefit_usage` | all columns |
| `LoyaltyAccounts` | `app/models/membership.py:116` | `membership.loyalty_accounts` | all columns |
| `LoyaltyLedger` | `app/models/membership.py:132` | `membership.loyalty_ledger` | all columns |
| `PlanBenefits` | `app/models/membership.py:47` | `membership.plan_benefits` | all columns |
| `MembershipPlans` | `app/models/membership.py:28` | `membership.plans` | all columns |
| `Subscriptions` | `app/models/membership.py:65` | `membership.subscriptions` | all columns |

## notification

## SQLAlchemy models for `notification`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `DeviceEndpoints` | `app/models/notification.py:219` | `notification.device_endpoints` | all columns |
| `InAppNotifications` | `app/models/notification.py:257` | `notification.in_app_notifications` | all columns |
| `MessageAttachments` | `app/models/notification.py:153` | `notification.message_attachments` | all columns |
| `MessageAttempts` | `app/models/notification.py:182` | `notification.message_attempts` | all columns |
| `Messages` | `app/models/notification.py:78` | `notification.messages` | all columns |
| `ProviderConfigurations` | `app/models/notification.py:51` | `notification.provider_configurations` | all columns |
| `ProviderWebhooks` | `app/models/notification.py:202` | `notification.provider_webhooks` | all columns |
| `NotificationSuppressions` | `app/models/notification.py:312` | `notification.suppressions` | all columns |
| `Templates` | `app/models/notification.py:30` | `notification.templates` | all columns |
| `UserChannelPreferences` | `app/models/notification.py:295` | `notification.user_channel_preferences` | all columns |

## organization

## SQLAlchemy models for `organization`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `OrganizationBankAccounts` | `app/models/organization.py:175` | `organization.bank_accounts` | all columns |
| `Departments` | `app/models/organization.py:83` | `organization.departments` | all columns |
| `Licenses` | `app/models/organization.py:141` | `organization.licenses` | all columns |
| `Locations` | `app/models/organization.py:54` | `organization.locations` | all columns |
| `Memberships` | `app/models/organization.py:104` | `organization.memberships` | all columns |
| `Organizations` | `app/models/organization.py:27` | `organization.organizations` | all columns |

## payment

## SQLAlchemy models for `payment`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `Chargebacks` | `app/models/payment.py:200` | `payment.chargebacks` | all columns |
| `CodCollections` | `app/models/payment.py:225` | `payment.cod_collections` | all columns |
| `CustomerPaymentMethods` | `app/models/payment.py:45` | `payment.customer_payment_methods` | all columns |
| `PaymentAttempts` | `app/models/payment.py:101` | `payment.payment_attempts` | all columns |
| `PaymentIntents` | `app/models/payment.py:69` | `payment.payment_intents` | all columns |
| `PaymentTransactions` | `app/models/payment.py:126` | `payment.payment_transactions` | all columns |
| `PaymentWebhooks` | `app/models/payment.py:151` | `payment.payment_webhooks` | all columns |
| `PaymentProviderAccounts` | `app/models/payment.py:30` | `payment.provider_accounts` | all columns |
| `ReconciliationItems` | `app/models/payment.py:268` | `payment.reconciliation_items` | all columns |
| `ReconciliationRuns` | `app/models/payment.py:246` | `payment.reconciliation_runs` | all columns |
| `RefundAllocations` | `app/models/pharmville.py:280` | `payment.refund_allocations` | all columns |
| `RefundReasonCodes` | `app/models/reference_data.py:95` | `payment.refund_reason_codes` | all columns |
| `Refunds` | `app/models/payment.py:170` | `payment.refunds` | all columns |

## platform

## SQLAlchemy models for `platform`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `ApplicationSettings` | `app/models/platform.py:141` | `platform.application_settings` | all columns |
| `AuditLogs` | `app/models/platform.py:101` | `platform.audit_logs` | all columns |
| `CMSBanners` | `app/models/pharmville.py:424` | `platform.cms_banners` | all columns |
| `CMSPageVersions` | `app/models/pharmville.py:398` | `platform.cms_page_versions` | all columns |
| `CMSPages` | `app/models/pharmville.py:372` | `platform.cms_pages` | all columns |
| `DataRetentionPolicies` | `app/models/platform.py:156` | `platform.data_retention_policies` | all columns |
| `FeatureFlags` | `app/models/platform.py:127` | `platform.feature_flags` | all columns |
| `FileAccessEvents` | `app/models/platform.py:371` | `platform.file_access_events` | all columns |
| `FileAccessGrants` | `app/models/platform.py:325` | `platform.file_access_grants` | all columns |
| `FileObjects` | `app/models/platform.py:171` | `platform.file_objects` | all columns |
| `FileScanEvents` | `app/models/platform.py:355` | `platform.file_scan_events` | all columns |
| `FileUploadSessions` | `app/models/platform.py:247` | `platform.file_upload_sessions` | all columns |
| `FileVariants` | `app/models/platform.py:292` | `platform.file_variants` | all columns |
| `IdempotencyKeys` | `app/models/platform.py:82` | `platform.idempotency_keys` | all columns |
| `InboxMessages` | `app/models/platform.py:63` | `platform.inbox_messages` | all columns |
| `OutboxEvents` | `app/models/platform.py:36` | `platform.outbox_events` | all columns |
| `ReportDefinitions` | `app/models/pharmville.py:449` | `platform.report_definitions` | all columns |
| `ReportRuns` | `app/models/pharmville.py:468` | `platform.report_runs` | all columns |
| `ScheduledJobs` | `app/models/platform.py:438` | `platform.scheduled_jobs` | all columns |
| `WebhookDeliveries` | `app/models/platform.py:417` | `platform.webhook_deliveries` | all columns |
| `WebhookEndpoints` | `app/models/platform.py:402` | `platform.webhook_endpoints` | all columns |

## pricing

## SQLAlchemy models for `pricing`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `CouponCodes` | `app/models/pricing.py:145` | `pricing.coupon_codes` | all columns |
| `PriceBooks` | `app/models/pricing.py:28` | `pricing.price_books` | all columns |
| `PricingEvaluations` | `app/models/pricing.py:194` | `pricing.pricing_evaluations` | all columns |
| `ProductPrices` | `app/models/pricing.py:51` | `pricing.product_prices` | all columns |
| `PromotionRedemptions` | `app/models/pricing.py:167` | `pricing.promotion_redemptions` | all columns |
| `PromotionVersions` | `app/models/pricing.py:127` | `pricing.promotion_versions` | all columns |
| `Promotions` | `app/models/pricing.py:101` | `pricing.promotions` | all columns |
| `TaxRules` | `app/models/pricing.py:82` | `pricing.tax_rules` | all columns |

## procurement

## SQLAlchemy models for `procurement`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `GoodsReceiptItems` | `app/models/procurement.py:270` | `procurement.goods_receipt_items` | all columns |
| `GoodsReceiptQualityChecks` | `app/models/procurement.py:299` | `procurement.goods_receipt_quality_checks` | all columns |
| `GoodsReceipts` | `app/models/procurement.py:241` | `procurement.goods_receipts` | all columns |
| `PurchaseOrderItems` | `app/models/procurement.py:184` | `procurement.purchase_order_items` | all columns |
| `PurchaseOrders` | `app/models/procurement.py:149` | `procurement.purchase_orders` | all columns |
| `PurchaseRequisitionItems` | `app/models/procurement.py:127` | `procurement.purchase_requisition_items` | all columns |
| `PurchaseRequisitions` | `app/models/procurement.py:106` | `procurement.purchase_requisitions` | all columns |
| `PurchaseReturnItems` | `app/models/procurement.py:340` | `procurement.purchase_return_items` | all columns |
| `PurchaseReturns` | `app/models/procurement.py:318` | `procurement.purchase_returns` | all columns |
| `SupplierInvoices` | `app/models/procurement.py:214` | `procurement.supplier_invoices` | all columns |
| `SupplierLicenses` | `app/models/procurement.py:54` | `procurement.supplier_licenses` | all columns |
| `SupplierProducts` | `app/models/procurement.py:79` | `procurement.supplier_products` | all columns |
| `Suppliers` | `app/models/procurement.py:30` | `procurement.suppliers` | all columns |

## risk

## SQLAlchemy models for `risk`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `RiskAssessments` | `app/models/risk.py:44` | `risk.assessments` | all columns |
| `Blocklists` | `app/models/risk.py:106` | `risk.blocklists` | all columns |
| `RiskCases` | `app/models/risk.py:83` | `risk.cases` | all columns |
| `RiskRules` | `app/models/risk.py:28` | `risk.rules` | all columns |
| `RiskSignals` | `app/models/risk.py:65` | `risk.signals` | all columns |

## search

## SQLAlchemy models for `search`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `SearchDocuments` | `app/models/search.py:53` | `search.documents` | all columns |
| `IndexingJobs` | `app/models/search.py:71` | `search.indexing_jobs` | all columns |
| `SearchQueryEvents` | `app/models/search.py:90` | `search.query_events` | all columns |
| `SearchRedirects` | `app/models/search.py:39` | `search.redirects` | all columns |
| `SearchSynonyms` | `app/models/search.py:24` | `search.synonyms` | all columns |

## support

## SQLAlchemy models for `support`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `SlaPolicies` | `app/models/support.py:26` | `support.sla_policies` | all columns |
| `TicketActions` | `app/models/support.py:131` | `support.ticket_actions` | all columns |
| `TicketAttachments` | `app/models/support.py:109` | `support.ticket_attachments` | all columns |
| `TicketMessages` | `app/models/support.py:88` | `support.ticket_messages` | all columns |
| `TicketStatusHistory` | `app/models/support.py:154` | `support.ticket_status_history` | all columns |
| `TicketTagAssignments` | `app/models/support.py:181` | `support.ticket_tag_assignments` | all columns |
| `TicketTags` | `app/models/support.py:170` | `support.ticket_tags` | all columns |
| `Tickets` | `app/models/support.py:44` | `support.tickets` | all columns |

## warehouse

## SQLAlchemy models for `warehouse`

**Confirmed from Python AST:** `__tablename__` and `__table_args__` map to the exact existing database tables; static declarations are not proof that the application runtime has been implemented.

| Class | Python model source | Exact migrated table | Field reference |
| --- | --- | --- | --- |
| `Aisles` | `app/models/warehouse.py:76` | `warehouse.aisles` | all columns |
| `Bins` | `app/models/warehouse.py:112` | `warehouse.bins` | all columns |
| `CycleCountItems` | `app/models/warehouse.py:411` | `warehouse.cycle_count_items` | all columns |
| `CycleCounts` | `app/models/warehouse.py:388` | `warehouse.cycle_counts` | all columns |
| `InventoryAdjustmentItems` | `app/models/warehouse.py:320` | `warehouse.inventory_adjustment_items` | all columns |
| `InventoryAdjustments` | `app/models/warehouse.py:301` | `warehouse.inventory_adjustments` | all columns |
| `InventoryLots` | `app/models/warehouse.py:139` | `warehouse.inventory_lots` | all columns |
| `Racks` | `app/models/warehouse.py:94` | `warehouse.racks` | all columns |
| `ReplenishmentRules` | `app/models/warehouse.py:435` | `warehouse.replenishment_rules` | all columns |
| `StockBalances` | `app/models/warehouse.py:180` | `warehouse.stock_balances` | all columns |
| `StockHolds` | `app/models/warehouse.py:277` | `warehouse.stock_holds` | all columns |
| `StockLedger` | `app/models/warehouse.py:210` | `warehouse.stock_ledger` | all columns |
| `StockMovementReasonCodes` | `app/models/reference_data.py:90` | `warehouse.stock_movement_reason_codes` | all columns |
| `StockReservations` | `app/models/warehouse.py:241` | `warehouse.stock_reservations` | all columns |
| `StockTransferItems` | `app/models/warehouse.py:366` | `warehouse.stock_transfer_items` | all columns |
| `StockTransfers` | `app/models/warehouse.py:341` | `warehouse.stock_transfers` | all columns |
| `Warehouses` | `app/models/warehouse.py:31` | `warehouse.warehouses` | all columns |
| `Zones` | `app/models/warehouse.py:56` | `warehouse.zones` | all columns |
