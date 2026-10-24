# `identity.users`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds users records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 9 constraints, 5 indexes, 1 triggers; PK: `id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_closed_at` | `timestamp with time zone` | Yes | — | Time of account closed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_users_created_by_users) |
| `email` | `character varying(320)` | Yes | — | Inferred: stores email for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `email_normalized` | `character varying(320)` | Yes | — | Inferred: stores email normalized for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `email_verified_at` | `timestamp with time zone` | Yes | — | Time of email verified | Support chronology, deadlines or audit evidence | See exact constraints |
| `failed_login_count` | `integer` | No | `0` | Inferred: stores failed login count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `last_login_at` | `timestamp with time zone` | Yes | — | Time of last login | Support chronology, deadlines or audit evidence | See exact constraints |
| `locked_until` | `timestamp with time zone` | Yes | — | Inferred: stores locked until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `password_hash` | `character varying(255)` | Yes | — | Inferred: stores password hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `phone_country_code` | `character varying(8)` | Yes | — | Code for phone country | Link to controlled business classification or an external reference | See exact constraints |
| `phone_number` | `character varying(32)` | Yes | — | Inferred: stores phone number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `phone_verified_at` | `timestamp with time zone` | Yes | — | Time of phone verified | Support chronology, deadlines or audit evidence | See exact constraints |
| `preferred_locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores preferred locale for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `privacy_version` | `character varying(32)` | Yes | — | Inferred: stores privacy version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `terms_version` | `character varying(32)` | Yes | — | Inferred: stores terms version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_users_updated_by_users) |

**Primary key columns (Confirmed):** `id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the users business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.users` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_users_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_users_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 634 FK constraints** (sample): `identity.user_roles`, `identity.sessions`, `identity.mfa_factors`, `identity.trusted_devices`, `identity.login_attempts`, `identity.password_history`, `identity.user_profiles`, `organization.memberships`, `organization.memberships`, `customer.family_members`, `customer.family_members`, `customer.family_members`.

## `identity.users` — exact structural contracts

**Identity:** `id` UUID.

**Counts:** 22 columns, 9 constraints, 5 indexes, 1 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_users_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_users_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_users_contact_required` | CHECK | `CHECK (email_normalized IS NOT NULL OR phone_number IS NOT NULL)` |
| `ck_identity_users_failed_login_nonnegative` | CHECK | `CHECK (failed_login_count >= 0)` |
| `ck_identity_users_phone_pair_complete` | CHECK | `CHECK (phone_country_code IS NULL AND phone_number IS NULL OR phone_country_code IS NOT NULL AND phone_number IS NOT NULL)` |
| `ck_identity_users_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_identity_users_userstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'active'::text, 'locked'::text, 'suspended'::text, 'closed'::text]))` |
| `fk_identity_users_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_users_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_users` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `users_email_normalized` | UNIQUE | `UNIQUE (email_normalized)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_users_last_login_at` | `CREATE INDEX ix_identity_users_last_login_at ON identity.users USING btree (last_login_at)` |
| `ix_identity_users_status` | `CREATE INDEX ix_identity_users_status ON identity.users USING btree (status)` |
| `pk_identity_users` | `CREATE UNIQUE INDEX pk_identity_users ON identity.users USING btree (id)` |
| `uq_identity_users_phone_present` | `CREATE UNIQUE INDEX uq_identity_users_phone_present ON identity.users USING btree (phone_country_code, phone_number) WHERE phone_country_code IS NOT NULL AND phone_number IS NOT NULL` |
| `users_email_normalized` | `CREATE UNIQUE INDEX users_email_normalized ON identity.users USING btree (email_normalized)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.users FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `identity.users` |
| Category | Master / Reference — Stable identity account master; credentials are protected attributes |
| Proposed owner / maintenance role | Authentication_Access / Identity administrator / verified onboarding |
| Scope | User/patient-specific protected party master. |
| Referencing tables | `appointment.appointment_slots`, `appointment.appointment_status_history`, `appointment.appointments`, `appointment.availability_exceptions`, `appointment.availability_rules`, `appointment.practitioner_services`, `appointment.service_types`, `appointment.teleconsultation_sessions`, `catalog.brands`, `catalog.categories`, `catalog.commerce_classes`, `catalog.dosage_forms`, `catalog.manufacturers`, `catalog.product_attributes`, `catalog.product_classification_history`, `catalog.product_content`, `catalog.product_identifiers`, `catalog.product_media`, `catalog.product_regulatory`, `catalog.product_relationships`, `catalog.product_salts`, `catalog.product_variants`, `catalog.products`, `catalog.salts`, `catalog.substitution_group_products`, `catalog.substitution_groups`, `catalog.units_of_measure`, `clinical.care_episodes`, `clinical.consultations`, `clinical.diagnoses`, `clinical.observations`, `clinical.order_reviews`, `clinical.patient_allergies`, `clinical.patient_conditions`, `clinical.patient_medications`, `clinical.patient_profiles`, `clinical.practitioner_organizations`, `clinical.practitioner_profiles`, `clinical.prescription_access_logs`, `clinical.prescription_documents`, `clinical.prescription_items`, `clinical.prescriptions`, `clinical.review_reason_codes`, `commerce.cancellation_items`, `commerce.cancellation_reason_codes`, `commerce.cancellations`, `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_allocations`, `commerce.order_charges`, `commerce.order_discounts`, `commerce.order_groups`, `commerce.order_items`, `commerce.order_revisions`, `commerce.order_status_history`, `commerce.orders`, `commerce.return_items`, `commerce.return_reason_codes`, `commerce.returns`, `compliance.adverse_event_reports`, `compliance.legal_holds`, `compliance.privacy_requests`, `compliance.product_recalls`, `compliance.recall_lots`, `compliance.regulatory_authorities`, `compliance.regulatory_registrations`, `customer.addresses`, `customer.consent_events`, `customer.consents`, `customer.family_members`, `customer.preferences`, `customer.profiles`, `customer.wishlist_items`, `customer.wishlists`, `diagnostics.diagnostic_order_items`, `diagnostics.diagnostic_orders`, `diagnostics.diagnostic_reports`, `diagnostics.diagnostic_result_values`, `diagnostics.lab_locations`, `diagnostics.lab_offerings`, `diagnostics.lab_providers`, `diagnostics.sample_collections`, `diagnostics.sample_events`, `diagnostics.samples`, `diagnostics.test_definitions`, `diagnostics.test_package_items`, `diagnostics.test_packages`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`, `finance.invoices`, `finance.journal_entries`, `finance.settlement_runs`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`, `fulfillment.package_items`, `fulfillment.packages`, `fulfillment.pick_task_items`, `fulfillment.pick_tasks`, `fulfillment.picking_wave_orders`, `fulfillment.picking_waves`, `identity.api_client_secrets`, `identity.api_clients`, `identity.login_attempts`, `identity.mfa_factors`, `identity.otp_challenges`, `identity.password_history`, `identity.permissions`, `identity.role_permissions`, `identity.roles`, `identity.sessions`, `identity.trusted_devices`, `identity.user_profiles`, `identity.user_roles`, `identity.users`, `insurance.claim_documents`, `insurance.claims`, `insurance.insurers`, `insurance.policies`, `insurance.policy_members`, `insurance.tpas`, `logistics.carrier_accounts`, `logistics.carriers`, `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`, `logistics.delivery_routes`, `logistics.delivery_slots`, `logistics.ndr_cases`, `logistics.reverse_shipments`, `logistics.rider_shifts`, `logistics.serviceability_rules`, `logistics.shipments`, `marketplace.commission_plans`, `marketplace.seller_commission_assignments`, `marketplace.seller_locations`, `marketplace.seller_product_listings`, `marketplace.seller_ratings`, `marketplace.seller_service_levels`, `marketplace.sellers`, `membership.loyalty_accounts`, `membership.plan_benefits`, `membership.plans`, `membership.subscriptions`, `notification.device_endpoints`, `notification.in_app_notifications`, `notification.message_attachments`, `notification.messages`, `notification.provider_configurations`, `notification.provider_webhooks`, `notification.suppressions`, `notification.templates`, `notification.user_channel_preferences`, `organization.bank_accounts`, `organization.departments`, `organization.licenses`, `organization.locations`, `organization.memberships`, `organization.organizations`, `payment.chargebacks`, `payment.cod_collections`, `payment.customer_payment_methods`, `payment.payment_attempts`, `payment.payment_intents`, `payment.payment_webhooks`, `payment.provider_accounts`, `payment.reconciliation_items`, `payment.reconciliation_runs`, `payment.refund_reason_codes`, `payment.refunds`, `platform.application_settings`, `platform.audit_logs`, `platform.cms_page_versions`, `platform.cms_pages`, `platform.data_retention_policies`, `platform.feature_flags`, `platform.file_access_events`, `platform.file_access_grants`, `platform.file_objects`, `platform.file_upload_sessions`, `platform.file_variants`, `platform.idempotency_keys`, `platform.inbox_messages`, `platform.outbox_events`, `platform.report_runs`, `platform.scheduled_jobs`, `platform.webhook_deliveries`, `platform.webhook_endpoints`, `pricing.coupon_codes`, `pricing.price_books`, `pricing.pricing_evaluations`, `pricing.product_prices`, `pricing.promotion_redemptions`, `pricing.promotion_versions`, `pricing.promotions`, `pricing.tax_rules`, `procurement.goods_receipt_items`, `procurement.goods_receipt_quality_checks`, `procurement.goods_receipts`, `procurement.purchase_order_items`, `procurement.purchase_orders`, `procurement.purchase_requisition_items`, `procurement.purchase_requisitions`, `procurement.purchase_return_items`, `procurement.purchase_returns`, `procurement.supplier_invoices`, `procurement.supplier_licenses`, `procurement.supplier_products`, `procurement.suppliers`, `risk.assessments`, `risk.blocklists`, `risk.cases`, `risk.rules`, `search.documents`, `search.indexing_jobs`, `search.query_events`, `search.redirects`, `search.synonyms`, `support.sla_policies`, `support.ticket_actions`, `support.ticket_attachments`, `support.ticket_messages`, `support.ticket_status_history`, `support.ticket_tags`, `support.tickets`, `warehouse.aisles`, `warehouse.bins`, `warehouse.cycle_count_items`, `warehouse.cycle_counts`, `warehouse.inventory_adjustment_items`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.racks`, `warehouse.replenishment_rules`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`, `warehouse.stock_movement_reason_codes`, `warehouse.stock_reservations`, `warehouse.stock_transfer_items`, `warehouse.stock_transfers`, `warehouse.warehouses`, `warehouse.zones` |
| Features | `ACC-01`, `ACC-02`, `ACC-03`, `ACC-04`, `ACC-05`, `ACC-06`, `ACC-07`, `ADM-01`, `ADM-02`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `AUD-01`, `AUD-02`, `AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `DLV-05`, `FIN-01`, `FIN-02`, `FIN-03`, `FIN-05`, `FIN-06`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-07`, `RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-06`, `RX-01`, `RX-04`, `RX-05`, `STO-01`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-001](../../../05-APIs/Customer_Accounts.md), [API-002](../../../05-APIs/Customer_Accounts.md), [API-003](../../../05-APIs/Customer_Accounts.md), [API-004](../../../05-APIs/Customer_Accounts.md), [API-005](../../../05-APIs/Customer_Accounts.md), [API-006](../../../05-APIs/Customer_Accounts.md), [API-007](../../../05-APIs/Customer_Accounts.md), [API-008](../../../05-APIs/Customer_Accounts.md), [API-009](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-005](../../../05-APIs/Customer_Accounts.md), [API-010](../../../05-APIs/Product_Catalog.md), [API-011](../../../05-APIs/Product_Catalog.md), [API-012](../../../05-APIs/Product_Catalog.md), [API-013](../../../05-APIs/Product_Catalog.md), [API-014](../../../05-APIs/Product_Catalog.md), [API-015](../../../05-APIs/Product_Catalog.md), [API-016](../../../05-APIs/Product_Catalog.md), [API-017](../../../05-APIs/Product_Catalog.md), [API-018](../../../05-APIs/Cart_Checkout.md), [API-019](../../../05-APIs/Cart_Checkout.md), [API-020](../../../05-APIs/Cart_Checkout.md), [API-021](../../../05-APIs/Cart_Checkout.md), [API-022](../../../05-APIs/Prescription_Upload.md), [API-023](../../../05-APIs/Prescription_Upload.md), [API-024](../../../05-APIs/Prescription_Upload.md), [API-025](../../../05-APIs/Customer_Orders.md), [API-026](../../../05-APIs/Customer_Orders.md), [API-027](../../../05-APIs/Customer_Orders.md), [API-028](../../../05-APIs/Customer_Orders.md), [API-029](../../../05-APIs/Customer_Orders.md), [API-030](../../../05-APIs/Customer_Orders.md), [API-031](../../../05-APIs/Customer_Orders.md), [API-032](../../../05-APIs/Admin_CMS.md), [API-033](../../../05-APIs/Admin_CMS.md), [API-034](../../../05-APIs/Admin_CMS.md), [API-035](../../../05-APIs/Admin_CMS.md), [API-036](../../../05-APIs/Admin_CMS.md), [API-037](../../../05-APIs/Admin_CMS.md), [API-038](../../../05-APIs/Admin_CMS.md), [API-039](../../../05-APIs/Order_Operations.md), [API-040](../../../05-APIs/Order_Operations.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-043](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-048](../../../05-APIs/Store_Operations.md), [API-049](../../../05-APIs/Store_Operations.md), [API-050](../../../05-APIs/Inventory.md), [API-051](../../../05-APIs/Inventory.md), [API-052](../../../05-APIs/Inventory.md), [API-053](../../../05-APIs/Inventory.md), [API-054](../../../05-APIs/Inventory.md), [API-055](../../../05-APIs/Inventory.md), [API-056](../../../05-APIs/Warehouse.md), [API-057](../../../05-APIs/Warehouse.md), [API-058](../../../05-APIs/Warehouse.md), [API-059](../../../05-APIs/Warehouse.md), [API-060](../../../05-APIs/Pharmacist_Review.md), [API-061](../../../05-APIs/Pharmacist_Review.md), [API-062](../../../05-APIs/Pharmacist_Review.md), [API-063](../../../05-APIs/Pharmacist_Review.md), [API-064](../../../05-APIs/Delivery_Operations.md), [API-065](../../../05-APIs/Delivery_Operations.md), [API-066](../../../05-APIs/Delivery_Operations.md), [API-067](../../../05-APIs/Delivery_Operations.md), [API-068](../../../05-APIs/Delivery_Operations.md), [API-069](../../../05-APIs/Rider_App.md), [API-070](../../../05-APIs/Rider_App.md), [API-071](../../../05-APIs/Rider_App.md), [API-072](../../../05-APIs/Rider_App.md), [API-073](../../../05-APIs/Rider_App.md), [API-074](../../../05-APIs/Rider_App.md), [API-075](../../../05-APIs/Finance_Payments.md), [API-076](../../../05-APIs/Finance_Payments.md), [API-077](../../../05-APIs/Finance_Payments.md), [API-078](../../../05-APIs/Finance_Payments.md), [API-079](../../../05-APIs/Finance_Payments.md), [API-080](../../../05-APIs/Finance_Payments.md), [API-081](../../../05-APIs/Finance_Payments.md), [API-082](../../../05-APIs/Reporting.md), [API-083](../../../05-APIs/Reporting.md), [API-084](../../../05-APIs/Reporting.md), [API-085](../../../05-APIs/Reporting.md), [API-086](../../../05-APIs/Reporting.md), [API-087](../../../05-APIs/Audit.md), [API-088](../../../05-APIs/Audit.md), [API-089](../../../05-APIs/Authentication_Access.md), [API-090](../../../05-APIs/Authentication_Access.md), [API-091](../../../05-APIs/Authentication_Access.md), [API-092](../../../05-APIs/Authentication_Access.md), [API-093](../../../05-APIs/Authentication_Access.md), [API-094](../../../05-APIs/Notifications.md), [API-095](../../../05-APIs/Notifications.md), [API-096](../../../05-APIs/Notifications.md), [API-097](../../../05-APIs/Notifications.md), [ACC-ROUTE-001](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-002](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-007](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-006](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-003](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-004](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-008](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-009](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-010](../../../05-APIs/Customer_Accounts.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: .

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Identity administrator / verified onboarding through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (email_normalized); CREATE UNIQUE INDEX uq_identity_users_phone_present ON identity.users USING btree (phone_country_code, phone_number) WHERE phone_country_code IS NOT NULL AND phone_number IS NOT NULL; CREATE UNIQUE INDEX users_email_normalized ON identity.users USING btree (email_normalized) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-003 exact role/grant and identity lifecycle approval. |
