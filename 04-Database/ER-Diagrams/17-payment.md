# Payment ER diagrams

## What this part of the database stores

The `payment` schema stores payment attempts, confirmation, and refunds. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`chargebacks`](../Tables/payment/chargebacks.md) | Holds chargebacks records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/chargebacks.md) |
| [`cod_collections`](../Tables/payment/cod_collections.md) | Holds cod collections records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/cod_collections.md) |
| [`customer_payment_methods`](../Tables/payment/customer_payment_methods.md) | Holds customer payment methods records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/customer_payment_methods.md) |
| [`payment_attempts`](../Tables/payment/payment_attempts.md) | Holds payment attempts records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/payment_attempts.md) |
| [`payment_intents`](../Tables/payment/payment_intents.md) | Holds payment intents records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/payment_intents.md) |
| [`payment_transactions`](../Tables/payment/payment_transactions.md) | Holds payment transactions records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/payment_transactions.md) |
| [`payment_webhooks`](../Tables/payment/payment_webhooks.md) | Holds payment webhooks records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/payment_webhooks.md) |
| [`provider_accounts`](../Tables/payment/provider_accounts.md) | Holds provider accounts records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/provider_accounts.md) |
| [`reconciliation_items`](../Tables/payment/reconciliation_items.md) | Holds reconciliation items records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/reconciliation_items.md) |
| [`reconciliation_runs`](../Tables/payment/reconciliation_runs.md) | Holds reconciliation runs records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/reconciliation_runs.md) |
| [`refund_allocations`](../Tables/payment/refund_allocations.md) | Holds refund allocations records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/refund_allocations.md) |
| [`refund_reason_codes`](../Tables/payment/refund_reason_codes.md) | Holds refund reason codes records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/refund_reason_codes.md) |
| [`refunds`](../Tables/payment/refunds.md) | Holds refunds records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/payment/refunds.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — refunds, chargebacks, refund_reason_codes, cod_collections, payment_intents, provider_accounts, payment_attempts, payment_transactions

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/payment.md) for exact columns and actions.

```mermaid
erDiagram
    commerce__order_revisions {
        uuid accepted_by_user_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid order_id FK, UK
        bigint order_id_internal_id FK, UK
        integer revision_number UK
    }
    commerce__orders {
        uuid checkout_id FK
        bigint checkout_id_internal_id FK
        uuid created_by FK
        uuid current_revision_id FK
        bigint current_revision_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar order_number UK
        uuid patient_profile_id FK, UK
        bigint patient_profile_id_internal_id FK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    commerce__returns {
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        varchar reason_code FK
        bigint reason_code_id FK
        varchar return_number UK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    logistics__shipments {
        uuid carrier_account_id FK
        bigint carrier_account_id_internal_id FK
        uuid carrier_id FK
        bigint carrier_id_internal_id FK
        uuid created_by FK
        uuid delivery_slot_id FK
        bigint delivery_slot_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid order_group_id FK
        bigint order_group_id_internal_id FK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid order_revision_id FK
        bigint order_revision_id_internal_id FK
        uuid package_id FK
        bigint package_id_internal_id FK
        varchar shipment_number UK
        uuid shipping_label_file_id FK
        bigint shipping_label_file_id_internal_id FK
        uuid updated_by FK
    }
    payment__chargebacks {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid payment_transaction_id FK
        bigint payment_transaction_id_internal_id FK
        varchar provider UK
        varchar provider_chargeback_id UK
        uuid updated_by FK
    }
    payment__cod_collections {
        uuid collected_by_user_id FK
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid order_revision_id FK
        bigint order_revision_id_internal_id FK
        uuid shipment_id FK, UK
        bigint shipment_id_internal_id FK
        uuid updated_by FK
    }
    payment__payment_attempts {
        integer attempt_number UK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid payment_intent_id FK, UK
        bigint payment_intent_id_internal_id FK
        uuid updated_by FK
    }
    payment__payment_intents {
        uuid created_by FK
        uuid id FK, UK
        varchar idempotency_key UK
        bigint internal_id PK, FK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid order_revision_id FK
        bigint order_revision_id_internal_id FK
        uuid provider_account_id FK
        bigint provider_account_id_internal_id FK
        uuid updated_by FK
    }
    payment__payment_transactions {
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid payment_attempt_id FK
        bigint payment_attempt_id_internal_id FK
        uuid payment_intent_id FK
        bigint payment_intent_id_internal_id FK
    }
    payment__provider_accounts {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar merchant_account_ref UK
        varchar provider UK
        uuid updated_by FK
    }
    payment__refund_reason_codes {
        varchar code FK, UK
        uuid created_by_user_id FK
        bigint id PK, FK, UK
        uuid updated_by_user_id FK
    }
    payment__refunds {
        uuid created_by FK
        uuid id FK, UK
        varchar idempotency_key UK
        bigint internal_id PK, FK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid order_revision_id FK, UK
        bigint order_revision_id_internal_id FK, UK
        uuid payment_transaction_id FK
        bigint payment_transaction_id_internal_id FK
        varchar reason_code FK
        bigint reason_code_id FK
        varchar refund_number UK
        uuid return_id FK
        bigint return_id_internal_id FK
        uuid updated_by FK
    }
    payment__refund_reason_codes o|--o{ payment__refunds : "FK-1036"
    identity__users o|--o{ payment__refunds : "FK-1037 FK-1046"
    commerce__returns o|--o{ payment__refunds : "FK-1042 FK-1043"
    payment__payment_transactions o|--o{ payment__refunds : "FK-1041 FK-1040"
    commerce__order_revisions o|--o{ payment__refunds : "FK-1044 FK-1045"
    commerce__orders ||--o{ payment__refunds : "FK-1038 FK-1039"
    identity__users o|--o{ payment__chargebacks : "FK-0977 FK-0982"
    commerce__orders ||--o{ payment__chargebacks : "FK-0978 FK-0979"
    payment__payment_transactions ||--o{ payment__chargebacks : "FK-0981 FK-0980"
    identity__users o|--o{ payment__refund_reason_codes : "FK-1034 FK-1035"
    identity__users o|--o{ payment__cod_collections : "FK-0984 FK-0991 FK-0983"
    commerce__orders ||--o{ payment__cod_collections : "FK-0985 FK-0986"
    logistics__shipments ||--o| payment__cod_collections : "FK-0989"
    commerce__order_revisions o|--o{ payment__cod_collections : "FK-0987 FK-0988"
    logistics__shipments ||--o{ payment__cod_collections : "FK-0990"
    identity__users o|--o{ payment__payment_intents : "FK-1002 FK-1007"
    payment__provider_accounts o|--o{ payment__payment_intents : "FK-1005 FK-1006"
    commerce__order_revisions o|--o{ payment__payment_intents : "FK-1000 FK-1001"
    commerce__orders ||--o{ payment__payment_intents : "FK-1003 FK-1004"
    identity__users o|--o{ payment__provider_accounts : "FK-1014 FK-1015 FK-1016"
    identity__users o|--o{ payment__payment_attempts : "FK-0996 FK-0999"
    payment__payment_intents ||--o{ payment__payment_attempts : "FK-0998 FK-0997"
    payment__payment_attempts o|--o{ payment__payment_transactions : "FK-1008 FK-1009"
    payment__payment_intents ||--o{ payment__payment_transactions : "FK-1011 FK-1010"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `commerce__order_revisions` | [`commerce.order_revisions`](../Tables/commerce/order_revisions.md) |
| `commerce__orders` | [`commerce.orders`](../Tables/commerce/orders.md) |
| `commerce__returns` | [`commerce.returns`](../Tables/commerce/returns.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `logistics__shipments` | [`logistics.shipments`](../Tables/logistics/shipments.md) |
| `payment__chargebacks` | [`payment.chargebacks`](../Tables/payment/chargebacks.md) |
| `payment__cod_collections` | [`payment.cod_collections`](../Tables/payment/cod_collections.md) |
| `payment__payment_attempts` | [`payment.payment_attempts`](../Tables/payment/payment_attempts.md) |
| `payment__payment_intents` | [`payment.payment_intents`](../Tables/payment/payment_intents.md) |
| `payment__payment_transactions` | [`payment.payment_transactions`](../Tables/payment/payment_transactions.md) |
| `payment__provider_accounts` | [`payment.provider_accounts`](../Tables/payment/provider_accounts.md) |
| `payment__refund_reason_codes` | [`payment.refund_reason_codes`](../Tables/payment/refund_reason_codes.md) |
| `payment__refunds` | [`payment.refunds`](../Tables/payment/refunds.md) |

Coverage: 8 focus tables, 13 entities, 47 FK constraints (47 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — refund_allocations, customer_payment_methods, payment_webhooks, reconciliation_items, reconciliation_runs

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/payment.md) for exact columns and actions.

```mermaid
erDiagram
    commerce__order_items {
        varchar commerce_class_snapshot FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid order_group_id FK
        bigint order_group_id_internal_id FK
        uuid order_id FK, UK
        bigint order_id_internal_id FK, UK
        uuid prescription_id FK
        bigint prescription_id_internal_id FK
        uuid product_id FK
        bigint product_id_internal_id FK
        uuid seller_id FK
        bigint seller_id_internal_id FK
        uuid updated_by FK
        uuid variant_id FK
        bigint variant_id_internal_id FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    payment__customer_payment_methods {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar provider UK
        varchar provider_token UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    payment__payment_webhooks {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar provider UK
        varchar provider_event_id UK
        uuid updated_by FK
    }
    payment__provider_accounts {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar merchant_account_ref UK
        varchar provider UK
        uuid updated_by FK
    }
    payment__reconciliation_items {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid run_id FK
        bigint run_id_internal_id FK
        uuid updated_by FK
    }
    payment__reconciliation_runs {
        uuid account_id FK, UK
        bigint account_id_internal_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar provider UK
        date run_date UK
        uuid source_file_id FK
        bigint source_file_id_internal_id FK
        uuid updated_by FK
    }
    payment__refund_allocations {
        uuid id UK
        bigint internal_id PK, UK
        uuid order_item_id FK, UK
        bigint order_item_id_internal_id FK
        uuid order_revision_id FK
        bigint order_revision_id_internal_id FK
        varchar reason_code FK
        bigint reason_code_id FK
        uuid refund_id FK, UK
        bigint refund_id_internal_id FK
    }
    payment__refund_reason_codes {
        varchar code FK, UK
        uuid created_by_user_id FK
        bigint id PK, FK, UK
        uuid updated_by_user_id FK
    }
    payment__refunds {
        uuid created_by FK
        uuid id FK, UK
        varchar idempotency_key UK
        bigint internal_id PK, FK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid order_revision_id FK, UK
        bigint order_revision_id_internal_id FK, UK
        uuid payment_transaction_id FK
        bigint payment_transaction_id_internal_id FK
        varchar reason_code FK
        bigint reason_code_id FK
        varchar refund_number UK
        uuid return_id FK
        bigint return_id_internal_id FK
        uuid updated_by FK
    }
    platform__file_objects {
        varchar bucket UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar object_key UK
        uuid updated_by FK
        uuid uploaded_by_user_id FK
    }
    payment__refund_reason_codes o|--o{ payment__refund_allocations : "FK-1027"
    commerce__order_items ||--o{ payment__refund_allocations : "FK-1028 FK-1029"
    payment__refunds ||--o{ payment__refund_allocations : "FK-1030 FK-1031"
    payment__refunds o|--o{ payment__refund_allocations : "FK-1032 FK-1033"
    identity__users ||--o{ payment__customer_payment_methods : "FK-0995"
    identity__users o|--o{ payment__customer_payment_methods : "FK-0992 FK-0993 FK-0994"
    identity__users o|--o{ payment__payment_webhooks : "FK-1012 FK-1013"
    identity__users o|--o{ payment__reconciliation_items : "FK-1017 FK-1020"
    payment__reconciliation_runs ||--o{ payment__reconciliation_items : "FK-1019 FK-1018"
    identity__users o|--o{ payment__reconciliation_runs : "FK-1023 FK-1026"
    platform__file_objects o|--o{ payment__reconciliation_runs : "FK-1025 FK-1024"
    payment__provider_accounts o|--o{ payment__reconciliation_runs : "FK-1022 FK-1021"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `commerce__order_items` | [`commerce.order_items`](../Tables/commerce/order_items.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `payment__customer_payment_methods` | [`payment.customer_payment_methods`](../Tables/payment/customer_payment_methods.md) |
| `payment__payment_webhooks` | [`payment.payment_webhooks`](../Tables/payment/payment_webhooks.md) |
| `payment__provider_accounts` | [`payment.provider_accounts`](../Tables/payment/provider_accounts.md) |
| `payment__reconciliation_items` | [`payment.reconciliation_items`](../Tables/payment/reconciliation_items.md) |
| `payment__reconciliation_runs` | [`payment.reconciliation_runs`](../Tables/payment/reconciliation_runs.md) |
| `payment__refund_allocations` | [`payment.refund_allocations`](../Tables/payment/refund_allocations.md) |
| `payment__refund_reason_codes` | [`payment.refund_reason_codes`](../Tables/payment/refund_reason_codes.md) |
| `payment__refunds` | [`payment.refunds`](../Tables/payment/refunds.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 5 focus tables, 11 entities, 23 FK constraints (23 unique IDs).

## How the tables connect

- **payment.chargebacks → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **payment.chargebacks → commerce.orders:** `order_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **payment.chargebacks → commerce.orders:** `order_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **payment.chargebacks → payment.payment_transactions:** `payment_transaction_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **payment.chargebacks → payment.payment_transactions:** `payment_transaction_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **payment.chargebacks → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/payment/README.md) · [Finance_Payments HLD](../../03-Modules/Finance_Payments/HLD.md) · [Finance_Payments LLD](../../03-Modules/Finance_Payments/LLD.md) · [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md) · [WF-009](../../06-Workflows/WF-009-COD-Collection.md) · [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md)
