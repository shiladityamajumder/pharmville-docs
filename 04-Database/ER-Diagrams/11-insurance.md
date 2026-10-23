# Insurance ER diagrams

## What this part of the database stores

The `insurance` schema stores policies and claims. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`claim_documents`](../Tables/insurance/claim_documents.md) | Holds claim documents records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/claim_documents.md) |
| [`claim_status_history`](../Tables/insurance/claim_status_history.md) | Holds claim status history records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/claim_status_history.md) |
| [`claims`](../Tables/insurance/claims.md) | Holds claims records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/claims.md) |
| [`eligibility_checks`](../Tables/insurance/eligibility_checks.md) | Holds eligibility checks records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/eligibility_checks.md) |
| [`insurers`](../Tables/insurance/insurers.md) | Holds insurers records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/insurers.md) |
| [`policies`](../Tables/insurance/policies.md) | Holds policies records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/policies.md) |
| [`policy_members`](../Tables/insurance/policy_members.md) | Holds policy members records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/policy_members.md) |
| [`tpas`](../Tables/insurance/tpas.md) | Holds tpas records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/insurance/tpas.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — policies, claims, policy_members, insurers, tpas, claim_documents, claim_status_history, eligibility_checks

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/insurance.md) for exact columns and actions.

```mermaid
erDiagram
    clinical__patient_profiles {
        uuid created_by FK
        uuid deleted_by FK
        uuid family_member_id FK
        bigint family_member_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    insurance__claim_documents {
        uuid claim_id FK
        bigint claim_id_internal_id FK
        uuid created_by FK
        uuid file_object_id FK, UK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    insurance__claim_status_history {
        uuid claim_id FK
        bigint claim_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    insurance__claims {
        varchar claim_number UK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        uuid policy_id FK
        bigint policy_id_internal_id FK
        uuid updated_by FK
    }
    insurance__eligibility_checks {
        uuid id UK
        bigint internal_id PK, UK
        uuid policy_id FK
        bigint policy_id_internal_id FK
    }
    insurance__insurers {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    insurance__policies {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        uuid insurer_id FK, UK
        bigint insurer_id_internal_id FK
        bigint internal_id PK, FK, UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        varchar policy_number_hash UK
        uuid tpa_id FK
        bigint tpa_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK
    }
    insurance__policy_members {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid patient_profile_id FK, UK
        bigint patient_profile_id_internal_id FK
        uuid policy_id FK, UK
        bigint policy_id_internal_id FK
        uuid updated_by FK
    }
    insurance__tpas {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    organization__organizations {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
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
    identity__users ||--o{ insurance__policies : "FK-0733"
    identity__users o|--o{ insurance__policies : "FK-0724 FK-0725 FK-0732"
    insurance__tpas o|--o{ insurance__policies : "FK-0730 FK-0731"
    insurance__insurers ||--o{ insurance__policies : "FK-0726 FK-0727"
    clinical__patient_profiles o|--o{ insurance__policies : "FK-0729 FK-0728"
    identity__users o|--o{ insurance__claims : "FK-0711 FK-0716"
    insurance__policies ||--o{ insurance__claims : "FK-0714 FK-0715"
    clinical__patient_profiles ||--o{ insurance__claims : "FK-0712 FK-0713"
    identity__users o|--o{ insurance__policy_members : "FK-0734 FK-0739"
    clinical__patient_profiles ||--o{ insurance__policy_members : "FK-0736 FK-0735"
    insurance__policies ||--o{ insurance__policy_members : "FK-0737 FK-0738"
    identity__users o|--o{ insurance__insurers : "FK-0719 FK-0720 FK-0723"
    organization__organizations o|--o{ insurance__insurers : "FK-0721 FK-0722"
    identity__users o|--o{ insurance__tpas : "FK-0740 FK-0741 FK-0744"
    organization__organizations o|--o{ insurance__tpas : "FK-0742 FK-0743"
    identity__users o|--o{ insurance__claim_documents : "FK-0705 FK-0708"
    platform__file_objects ||--o| insurance__claim_documents : "FK-0707"
    insurance__claims ||--o{ insurance__claim_documents : "FK-0703 FK-0704"
    platform__file_objects ||--o{ insurance__claim_documents : "FK-0706"
    insurance__claims ||--o{ insurance__claim_status_history : "FK-0709 FK-0710"
    insurance__policies ||--o{ insurance__eligibility_checks : "FK-0717 FK-0718"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `clinical__patient_profiles` | [`clinical.patient_profiles`](../Tables/clinical/patient_profiles.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `insurance__claim_documents` | [`insurance.claim_documents`](../Tables/insurance/claim_documents.md) |
| `insurance__claim_status_history` | [`insurance.claim_status_history`](../Tables/insurance/claim_status_history.md) |
| `insurance__claims` | [`insurance.claims`](../Tables/insurance/claims.md) |
| `insurance__eligibility_checks` | [`insurance.eligibility_checks`](../Tables/insurance/eligibility_checks.md) |
| `insurance__insurers` | [`insurance.insurers`](../Tables/insurance/insurers.md) |
| `insurance__policies` | [`insurance.policies`](../Tables/insurance/policies.md) |
| `insurance__policy_members` | [`insurance.policy_members`](../Tables/insurance/policy_members.md) |
| `insurance__tpas` | [`insurance.tpas`](../Tables/insurance/tpas.md) |
| `organization__organizations` | [`organization.organizations`](../Tables/organization/organizations.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 8 focus tables, 12 entities, 42 FK constraints (42 unique IDs).

## How the tables connect

- **insurance.claim_documents → insurance.claims:** `claim_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **insurance.claim_documents → insurance.claims:** `claim_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **insurance.claim_documents → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **insurance.claim_documents → platform.file_objects:** `file_object_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **insurance.claim_documents → platform.file_objects:** `file_object_id` references `id`; Each child must reference exactly one parent; each parent may have zero or one child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **insurance.claim_documents → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

No dedicated workflow from the 14 documented workflows is mapped to this schema. It is still represented because it exists in the checked-out database catalog.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/insurance/README.md)
