# Identity ER diagrams

## What this part of the database stores

The `identity` schema stores accounts, sessions, and permissions. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`api_client_secrets`](../Tables/identity/api_client_secrets.md) | Holds api client secrets records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/api_client_secrets.md) |
| [`api_clients`](../Tables/identity/api_clients.md) | Holds api clients records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/api_clients.md) |
| [`login_attempts`](../Tables/identity/login_attempts.md) | Holds login attempts records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/login_attempts.md) |
| [`mfa_factors`](../Tables/identity/mfa_factors.md) | Holds mfa factors records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/mfa_factors.md) |
| [`otp_challenges`](../Tables/identity/otp_challenges.md) | Holds otp challenges records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/otp_challenges.md) |
| [`password_history`](../Tables/identity/password_history.md) | Holds password history records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/password_history.md) |
| [`permissions`](../Tables/identity/permissions.md) | Holds permissions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/permissions.md) |
| [`role_permissions`](../Tables/identity/role_permissions.md) | Holds role permissions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/role_permissions.md) |
| [`roles`](../Tables/identity/roles.md) | Holds roles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/roles.md) |
| [`sessions`](../Tables/identity/sessions.md) | Holds sessions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/sessions.md) |
| [`trusted_devices`](../Tables/identity/trusted_devices.md) | Holds trusted devices records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/trusted_devices.md) |
| [`user_profiles`](../Tables/identity/user_profiles.md) | Holds user profiles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/user_profiles.md) |
| [`user_roles`](../Tables/identity/user_roles.md) | Holds user roles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/user_roles.md) |
| [`users`](../Tables/identity/users.md) | Holds users records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/identity/users.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — role_permissions, permissions, roles, user_roles, users, api_clients, api_client_secrets, mfa_factors

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/identity.md) for exact columns and actions.

```mermaid
erDiagram
    identity__api_client_secrets {
        uuid api_client_id FK
        bigint api_client_id_internal_id FK
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    identity__api_clients {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    identity__mfa_factors {
        uuid created_by FK
        varchar factor_type UK
        uuid id UK
        bigint internal_id PK, UK
        varchar label UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    identity__permissions {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    identity__role_permissions {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid permission_id FK, UK
        bigint permission_id_internal_id FK
        uuid role_id FK, UK
        bigint role_id_internal_id FK
        uuid updated_by FK
    }
    identity__roles {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    identity__user_roles {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid role_id FK, UK
        bigint role_id_internal_id FK
        uuid scope_id UK
        varchar scope_type UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    identity__users o|--o{ identity__role_permissions : "FK-0675 FK-0680"
    identity__permissions ||--o{ identity__role_permissions : "FK-0676 FK-0677"
    identity__roles ||--o{ identity__role_permissions : "FK-0678 FK-0679"
    identity__users o|--o{ identity__permissions : "FK-0672 FK-0673 FK-0674"
    identity__users o|--o{ identity__roles : "FK-0681 FK-0682 FK-0683"
    identity__users ||--o{ identity__user_roles : "FK-0700"
    identity__users o|--o{ identity__user_roles : "FK-0696 FK-0699"
    identity__roles ||--o{ identity__user_roles : "FK-0697 FK-0698"
    identity__users o|--o{ identity__users : "FK-0701 FK-0702"
    identity__users o|--o{ identity__api_clients : "FK-0662 FK-0663 FK-0664"
    identity__users o|--o{ identity__api_client_secrets : "FK-0660 FK-0661"
    identity__api_clients ||--o{ identity__api_client_secrets : "FK-0659 FK-0658"
    identity__users ||--o{ identity__mfa_factors : "FK-0668"
    identity__users o|--o{ identity__mfa_factors : "FK-0666 FK-0667"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__api_client_secrets` | [`identity.api_client_secrets`](../Tables/identity/api_client_secrets.md) |
| `identity__api_clients` | [`identity.api_clients`](../Tables/identity/api_clients.md) |
| `identity__mfa_factors` | [`identity.mfa_factors`](../Tables/identity/mfa_factors.md) |
| `identity__permissions` | [`identity.permissions`](../Tables/identity/permissions.md) |
| `identity__role_permissions` | [`identity.role_permissions`](../Tables/identity/role_permissions.md) |
| `identity__roles` | [`identity.roles`](../Tables/identity/roles.md) |
| `identity__user_roles` | [`identity.user_roles`](../Tables/identity/user_roles.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |

Coverage: 8 focus tables, 8 entities, 29 FK constraints (29 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — user_profiles, sessions, trusted_devices, otp_challenges, login_attempts, password_history

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/identity.md) for exact columns and actions.

```mermaid
erDiagram
    identity__login_attempts {
        uuid id UK
        bigint internal_id PK, UK
        uuid user_id FK
    }
    identity__otp_challenges {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    identity__password_history {
        uuid id UK
        bigint internal_id PK, UK
        uuid user_id FK
    }
    identity__sessions {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar refresh_token_hash UK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__trusted_devices {
        uuid created_by FK
        varchar device_fingerprint_hash UK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    identity__user_profiles {
        uuid avatar_file_id FK
        bigint avatar_file_id_internal_id FK
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
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
    identity__users ||--o{ identity__user_profiles : "FK-0695"
    identity__users o|--o{ identity__user_profiles : "FK-0692 FK-0693 FK-0694"
    platform__file_objects o|--o{ identity__user_profiles : "FK-0690 FK-0691"
    identity__users ||--o{ identity__sessions : "FK-0686"
    identity__users o|--o{ identity__sessions : "FK-0684 FK-0685"
    identity__users ||--o{ identity__trusted_devices : "FK-0689"
    identity__users o|--o{ identity__trusted_devices : "FK-0687 FK-0688"
    identity__users o|--o{ identity__otp_challenges : "FK-0669 FK-0670"
    identity__users o|--o{ identity__login_attempts : "FK-0665"
    identity__users ||--o{ identity__password_history : "FK-0671"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__login_attempts` | [`identity.login_attempts`](../Tables/identity/login_attempts.md) |
| `identity__otp_challenges` | [`identity.otp_challenges`](../Tables/identity/otp_challenges.md) |
| `identity__password_history` | [`identity.password_history`](../Tables/identity/password_history.md) |
| `identity__sessions` | [`identity.sessions`](../Tables/identity/sessions.md) |
| `identity__trusted_devices` | [`identity.trusted_devices`](../Tables/identity/trusted_devices.md) |
| `identity__user_profiles` | [`identity.user_profiles`](../Tables/identity/user_profiles.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 6 focus tables, 8 entities, 16 FK constraints (16 unique IDs).

## How the tables connect

- **identity.api_client_secrets → identity.api_clients:** `api_client_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **identity.api_client_secrets → identity.api_clients:** `api_client_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **identity.api_client_secrets → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **identity.api_client_secrets → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **identity.api_clients → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **identity.api_clients → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/identity/README.md) · [Authentication_Access HLD](../../03-Modules/Authentication_Access/HLD.md) · [Authentication_Access LLD](../../03-Modules/Authentication_Access/LLD.md) · [Customer_Accounts HLD](../../03-Modules/Customer_Accounts/HLD.md) · [Customer_Accounts LLD](../../03-Modules/Customer_Accounts/LLD.md) · [Rider_App HLD](../../03-Modules/Rider_App/HLD.md) · [Rider_App LLD](../../03-Modules/Rider_App/LLD.md) · [WF-001](../../06-Workflows/WF-001-Identity-and-Session.md) · [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md)
