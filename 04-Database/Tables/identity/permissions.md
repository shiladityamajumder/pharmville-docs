# `identity.permissions`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds permissions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 7 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | `character varying(64)` | No | — | Inferred: stores action for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `code` | `character varying(128)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_permissions_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_permissions_deleted_by_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `resource` | `character varying(64)` | No | — | Inferred: stores resource for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_permissions_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the permissions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.permissions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_permissions_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_identity_permissions_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_permissions_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `identity.role_permissions`, `identity.role_permissions`.

## `identity.permissions` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 7 constraints, 4 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_permissions_created_by_users` |
| `deleted_by` | `identity.users` | `fk_identity_permissions_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_identity_permissions_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_permissions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_identity_permissions_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_identity_permissions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_permissions_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_permissions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_permissions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_permissions_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_permissions_resource_action` | `CREATE INDEX ix_identity_permissions_resource_action ON identity.permissions USING btree (resource, action)` |
| `pk_identity_permissions` | `CREATE UNIQUE INDEX pk_identity_permissions ON identity.permissions USING btree (internal_id)` |
| `uq_identity_permissions_code_active` | `CREATE UNIQUE INDEX uq_identity_permissions_code_active ON identity.permissions USING btree (code) WHERE is_deleted = false` |
| `uq_identity_permissions_id` | `CREATE UNIQUE INDEX uq_identity_permissions_id ON identity.permissions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON identity.permissions FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `identity.permissions` |
| Category | Master / Reference — Action/resource grant vocabulary |
| Proposed owner / maintenance role | Authentication_Access / Security administrator |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `identity.role_permissions` |
| Features | `ACC-02`, `ACC-03`, `ACC-04`, `ACC-05`, `ACC-06`, `ACC-07`, `ADM-01`, `ADM-02`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `AUD-01`, `AUD-02`, `AUTH-02`, `AUTH-04`, `CHK-01`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `DLV-05`, `FIN-01`, `FIN-02`, `FIN-03`, `FIN-05`, `FIN-06`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-07`, `RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-06`, `RX-01`, `RX-04`, `RX-05`, `STO-01`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-003](../../../05-APIs/Customer_Accounts.md), [API-004](../../../05-APIs/Customer_Accounts.md), [API-005](../../../05-APIs/Customer_Accounts.md), [API-006](../../../05-APIs/Customer_Accounts.md), [API-007](../../../05-APIs/Customer_Accounts.md), [API-008](../../../05-APIs/Customer_Accounts.md), [API-009](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-005](../../../05-APIs/Customer_Accounts.md), [API-015](../../../05-APIs/Product_Catalog.md), [API-016](../../../05-APIs/Product_Catalog.md), [API-017](../../../05-APIs/Product_Catalog.md), [API-018](../../../05-APIs/Cart_Checkout.md), [API-019](../../../05-APIs/Cart_Checkout.md), [API-020](../../../05-APIs/Cart_Checkout.md), [API-021](../../../05-APIs/Cart_Checkout.md), [API-022](../../../05-APIs/Prescription_Upload.md), [API-023](../../../05-APIs/Prescription_Upload.md), [API-024](../../../05-APIs/Prescription_Upload.md), [API-025](../../../05-APIs/Customer_Orders.md), [API-026](../../../05-APIs/Customer_Orders.md), [API-027](../../../05-APIs/Customer_Orders.md), [API-028](../../../05-APIs/Customer_Orders.md), [API-029](../../../05-APIs/Customer_Orders.md), [API-030](../../../05-APIs/Customer_Orders.md), [API-031](../../../05-APIs/Customer_Orders.md), [API-032](../../../05-APIs/Admin_CMS.md), [API-033](../../../05-APIs/Admin_CMS.md), [API-034](../../../05-APIs/Admin_CMS.md), [API-035](../../../05-APIs/Admin_CMS.md), [API-036](../../../05-APIs/Admin_CMS.md), [API-037](../../../05-APIs/Admin_CMS.md), [API-038](../../../05-APIs/Admin_CMS.md), [API-039](../../../05-APIs/Order_Operations.md), [API-040](../../../05-APIs/Order_Operations.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-043](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-048](../../../05-APIs/Store_Operations.md), [API-049](../../../05-APIs/Store_Operations.md), [API-050](../../../05-APIs/Inventory.md), [API-051](../../../05-APIs/Inventory.md), [API-052](../../../05-APIs/Inventory.md), [API-053](../../../05-APIs/Inventory.md), [API-054](../../../05-APIs/Inventory.md), [API-055](../../../05-APIs/Inventory.md), [API-056](../../../05-APIs/Warehouse.md), [API-057](../../../05-APIs/Warehouse.md), [API-058](../../../05-APIs/Warehouse.md), [API-059](../../../05-APIs/Warehouse.md), [API-060](../../../05-APIs/Pharmacist_Review.md), [API-061](../../../05-APIs/Pharmacist_Review.md), [API-062](../../../05-APIs/Pharmacist_Review.md), [API-063](../../../05-APIs/Pharmacist_Review.md), [API-064](../../../05-APIs/Delivery_Operations.md), [API-065](../../../05-APIs/Delivery_Operations.md), [API-066](../../../05-APIs/Delivery_Operations.md), [API-067](../../../05-APIs/Delivery_Operations.md), [API-068](../../../05-APIs/Delivery_Operations.md), [API-069](../../../05-APIs/Rider_App.md), [API-070](../../../05-APIs/Rider_App.md), [API-071](../../../05-APIs/Rider_App.md), [API-072](../../../05-APIs/Rider_App.md), [API-073](../../../05-APIs/Rider_App.md), [API-074](../../../05-APIs/Rider_App.md), [API-075](../../../05-APIs/Finance_Payments.md), [API-077](../../../05-APIs/Finance_Payments.md), [API-078](../../../05-APIs/Finance_Payments.md), [API-079](../../../05-APIs/Finance_Payments.md), [API-080](../../../05-APIs/Finance_Payments.md), [API-081](../../../05-APIs/Finance_Payments.md), [API-082](../../../05-APIs/Reporting.md), [API-083](../../../05-APIs/Reporting.md), [API-084](../../../05-APIs/Reporting.md), [API-085](../../../05-APIs/Reporting.md), [API-086](../../../05-APIs/Reporting.md), [API-087](../../../05-APIs/Audit.md), [API-088](../../../05-APIs/Audit.md), [API-091](../../../05-APIs/Authentication_Access.md), [API-092](../../../05-APIs/Authentication_Access.md), [API-093](../../../05-APIs/Authentication_Access.md), [API-094](../../../05-APIs/Notifications.md), [API-095](../../../05-APIs/Notifications.md), [API-096](../../../05-APIs/Notifications.md), [API-097](../../../05-APIs/Notifications.md), [ACC-ROUTE-001](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-002](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-007](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-006](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-003](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-004](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-008](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-009](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-010](../../../05-APIs/Customer_Accounts.md) |

### Expected initial records

| Code | Name | Description | Status | Source | Additional schema attributes |
| --- | --- | --- | --- | --- | --- |
| admin.dashboard.read | admin.dashboard.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=admin; action=dashboard.read; description=Proposed admin.dashboard.read capability |
| admin.settings.manage | admin.settings.manage | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=admin; action=settings.manage; description=Proposed admin.settings.manage capability |
| admin.settings.read | admin.settings.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=admin; action=settings.read; description=Proposed admin.settings.read capability |
| audit.events.read | audit.events.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=audit; action=events.read; description=Proposed audit.events.read capability |
| audit.export | audit.export | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=audit; action=export; description=Proposed audit.export capability |
| cart-checkout.manage.own | cart-checkout.manage.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=cart-checkout; action=manage.own; description=Proposed cart-checkout.manage.own capability |
| cart-checkout.read.own | cart-checkout.read.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=cart-checkout; action=read.own; description=Proposed cart-checkout.read.own capability |
| catalog.classification.approve | catalog.classification.approve | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=catalog; action=classification.approve; description=Proposed catalog.classification.approve capability |
| catalog.import | catalog.import | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=catalog; action=import; description=Proposed catalog.import capability |
| catalog.publish | catalog.publish | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=catalog; action=publish; description=Proposed catalog.publish capability |
| clinical.reviews.decide | clinical.reviews.decide | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=clinical; action=reviews.decide; description=Proposed clinical.reviews.decide capability |
| clinical.reviews.read | clinical.reviews.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=clinical; action=reviews.read; description=Proposed clinical.reviews.read capability |
| cms.publish | cms.publish | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=cms; action=publish; description=Proposed cms.publish capability |
| customer-accounts.manage.own | customer-accounts.manage.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=customer-accounts; action=manage.own; description=Proposed customer-accounts.manage.own capability |
| customer-accounts.read.own | customer-accounts.read.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=customer-accounts; action=read.own; description=Proposed customer-accounts.read.own capability |
| customer-orders.manage.own | customer-orders.manage.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=customer-orders; action=manage.own; description=Proposed customer-orders.manage.own capability |
| customer-orders.read.own | customer-orders.read.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=customer-orders; action=read.own; description=Proposed customer-orders.read.own capability |
| delivery.assign | delivery.assign | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=assign; description=Proposed delivery.assign capability |
| delivery.complete.own | delivery.complete.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=complete.own; description=Proposed delivery.complete.own capability |
| delivery.exceptions.resolve | delivery.exceptions.resolve | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=exceptions.resolve; description=Proposed delivery.exceptions.resolve capability |
| delivery.failure.record.own | delivery.failure.record.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=failure.record.own; description=Proposed delivery.failure.record.own capability |
| delivery.location.write.own | delivery.location.write.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=location.write.own; description=Proposed delivery.location.write.own capability |
| delivery.pickup.own | delivery.pickup.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=pickup.own; description=Proposed delivery.pickup.own capability |
| delivery.riders.onboard | delivery.riders.onboard | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=riders.onboard; description=Proposed delivery.riders.onboard capability |
| delivery.shift.manage.own | delivery.shift.manage.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=shift.manage.own; description=Proposed delivery.shift.manage.own capability |
| delivery.tasks.read | delivery.tasks.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=tasks.read; description=Proposed delivery.tasks.read capability |
| delivery.tasks.read.own | delivery.tasks.read.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=delivery; action=tasks.read.own; description=Proposed delivery.tasks.read.own capability |
| finance.cod.handover.read | finance.cod.handover.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=finance; action=cod.handover.read; description=Proposed finance.cod.handover.read capability |
| finance.cod.reconcile | finance.cod.reconcile | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=finance; action=cod.reconcile; description=Proposed finance.cod.reconcile capability |
| finance.invoices.read | finance.invoices.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=finance; action=invoices.read; description=Proposed finance.invoices.read capability |
| finance.payments.read | finance.payments.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=finance; action=payments.read; description=Proposed finance.payments.read capability |
| finance.refunds.instruct | finance.refunds.instruct | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=finance; action=refunds.instruct; description=Proposed finance.refunds.instruct capability |
| finance.settlements.read | finance.settlements.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=finance; action=settlements.read; description=Proposed finance.settlements.read capability |
| fulfillment.accept | fulfillment.accept | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=fulfillment; action=accept; description=Proposed fulfillment.accept capability |
| fulfillment.pack.close | fulfillment.pack.close | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=fulfillment; action=pack.close; description=Proposed fulfillment.pack.close capability |
| fulfillment.pick.scan | fulfillment.pick.scan | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=fulfillment; action=pick.scan; description=Proposed fulfillment.pick.scan capability |
| fulfillment.queue.read | fulfillment.queue.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=fulfillment; action=queue.read; description=Proposed fulfillment.queue.read capability |
| identity.permissions.read.own | identity.permissions.read.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=identity; action=permissions.read.own; description=Proposed identity.permissions.read.own capability |
| identity.sessions.revoke.own | identity.sessions.revoke.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=identity; action=sessions.revoke.own; description=Proposed identity.sessions.revoke.own capability |
| identity.staff.invite | identity.staff.invite | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=identity; action=staff.invite; description=Proposed identity.staff.invite capability |
| identity.staff.manage | identity.staff.manage | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=identity; action=staff.manage; description=Proposed identity.staff.manage capability |
| inventory.adjustments.request | inventory.adjustments.request | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=inventory; action=adjustments.request; description=Proposed inventory.adjustments.request capability |
| inventory.alerts.read | inventory.alerts.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=inventory; action=alerts.read; description=Proposed inventory.alerts.read capability |
| inventory.observation.ingest | inventory.observation.ingest | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=inventory; action=observation.ingest; description=Proposed inventory.observation.ingest capability |
| inventory.read | inventory.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=inventory; action=read; description=Proposed inventory.read capability |
| inventory.reservations.create | inventory.reservations.create | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=inventory; action=reservations.create; description=Proposed inventory.reservations.create capability |
| inventory.reservations.release | inventory.reservations.release | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=inventory; action=reservations.release; description=Proposed inventory.reservations.release capability |
| notifications.alerts.read | notifications.alerts.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=notifications; action=alerts.read; description=Proposed notifications.alerts.read capability |
| notifications.deliveries.read | notifications.deliveries.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=notifications; action=deliveries.read; description=Proposed notifications.deliveries.read capability |
| notifications.devices.manage.own | notifications.devices.manage.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=notifications; action=devices.manage.own; description=Proposed notifications.devices.manage.own capability |
| notifications.jobs.create | notifications.jobs.create | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=notifications; action=jobs.create; description=Proposed notifications.jobs.create capability |
| orders.allocate | orders.allocate | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=orders; action=allocate; description=Proposed orders.allocate capability |
| orders.detail.read | orders.detail.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=orders; action=detail.read; description=Proposed orders.detail.read capability |
| orders.queue.read | orders.queue.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=orders; action=queue.read; description=Proposed orders.queue.read capability |
| orders.reassign | orders.reassign | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=orders; action=reassign; description=Proposed orders.reassign capability |
| orders.revision.accept.own | orders.revision.accept.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=orders; action=revision.accept.own; description=Proposed orders.revision.accept.own capability |
| orders.revision.propose | orders.revision.propose | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=orders; action=revision.propose; description=Proposed orders.revision.propose capability |
| organization.locations.create | organization.locations.create | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=organization; action=locations.create; description=Proposed organization.locations.create capability |
| payments.initiate.own | payments.initiate.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=payments; action=initiate.own; description=Proposed payments.initiate.own capability |
| prescription-upload.manage.own | prescription-upload.manage.own | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=prescription-upload; action=manage.own; description=Proposed prescription-upload.manage.own capability |
| reports.deliveries.read | reports.deliveries.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=reports; action=deliveries.read; description=Proposed reports.deliveries.read capability |
| reports.export | reports.export | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=reports; action=export; description=Proposed reports.export capability |
| reports.sales.read | reports.sales.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=reports; action=sales.read; description=Proposed reports.sales.read capability |
| reports.stock.read | reports.stock.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=reports; action=stock.read; description=Proposed reports.stock.read capability |
| reports.tax.read | reports.tax.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=reports; action=tax.read; description=Proposed reports.tax.read capability |
| warehouse.fallback.read | warehouse.fallback.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=warehouse; action=fallback.read; description=Proposed warehouse.fallback.read capability |
| warehouse.receipts.create | warehouse.receipts.create | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=warehouse; action=receipts.create; description=Proposed warehouse.receipts.create capability |
| warehouse.replenishment.read | warehouse.replenishment.read | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=warehouse; action=replenishment.read; description=Proposed warehouse.replenishment.read capability |
| warehouse.replenishment.request | warehouse.replenishment.request | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=warehouse; action=replenishment.request; description=Proposed warehouse.replenishment.request capability |
| warehouse.transfer.dispatch | warehouse.transfer.dispatch | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=warehouse; action=transfer.dispatch; description=Proposed warehouse.transfer.dispatch capability |
| warehouse.transfer.receive | warehouse.transfer.receive | Required action proposed by the per-operation authorization contract. | Proposed | 107-operation contract review; D-003/D-024 | resource=warehouse; action=transfer.receive; description=Proposed warehouse.transfer.receive capability |

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deployment reference seed after approval, followed by controlled administration. |
| Create/update permissions | Security administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_identity_permissions_code_active ON identity.permissions USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_identity_permissions_id ON identity.permissions USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Explicit rows above are Confirmed domain values or Proposed initial records, never observed production/seed data. No live row existence or seed execution was verified. |
| Pending decisions | D-024 ownership/lifecycle approval; D-003 exact role/grant and identity lifecycle approval. |
