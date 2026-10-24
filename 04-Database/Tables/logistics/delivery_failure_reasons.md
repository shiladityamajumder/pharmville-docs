# `logistics.delivery_failure_reasons`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds delivery failure reasons records within the logistics domain (riders, shipments, tracking and delivery). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 9 constraints, 3 indexes, 4 triggers; PK: `id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_failure_reasons_created_by_user_id_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `display_name` | `character varying(150)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sort_order` | `integer` | No | `0` | Inferred: stores sort order for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_logistics_delivery_failure_reasons_updated_by_user_id_users) |

**Primary key columns (Confirmed):** `id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the delivery failure reasons business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Delivery_Operations, Rider_App. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `logistics.delivery_failure_reasons` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by_user_id` → `identity.users(id)` via `fk_logistics_delivery_failure_reasons_created_by_user_id_users`; `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by_user_id` → `identity.users(id)` via `fk_logistics_delivery_failure_reasons_updated_by_user_id_users`; `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `logistics.delivery_attempts`, `logistics.ndr_cases`.

## `logistics.delivery_failure_reasons` — exact structural contracts

**Identity:** `id` BIGINT.

**Counts:** 11 columns, 9 constraints, 3 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by_user_id` | `identity.users` | `fk_logistics_delivery_failure_reasons_created_by_user_id_users` |
| `updated_by_user_id` | `identity.users` | `fk_logistics_delivery_failure_reasons_updated_by_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_logistics_delivery_failure_reasons_canonical_code` | CHECK | `CHECK (code::text ~ '^[A-Z][A-Z0-9_]{0,63}$'::text)` |
| `ck_logistics_delivery_failure_reasons_display_name_nonblank` | CHECK | `CHECK (length(btrim(display_name::text)) > 0)` |
| `ck_logistics_delivery_failure_reasons_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_logistics_delivery_failure_reasons_sort_order_nonnegative` | CHECK | `CHECK (sort_order >= 0)` |
| `fk_logistics_delivery_failure_reasons_created_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_logistics_delivery_failure_reasons_updated_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_logistics_delivery_failure_reasons` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `uq_logistics_delivery_failure_reasons_code` | UNIQUE | `UNIQUE (code)` |
| `uq_logistics_delivery_failure_reasons_id_code` | UNIQUE | `UNIQUE (id, code)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_logistics_delivery_failure_reasons` | `CREATE UNIQUE INDEX pk_logistics_delivery_failure_reasons ON logistics.delivery_failure_reasons USING btree (id)` |
| `uq_logistics_delivery_failure_reasons_code` | `CREATE UNIQUE INDEX uq_logistics_delivery_failure_reasons_code ON logistics.delivery_failure_reasons USING btree (code)` |
| `uq_logistics_delivery_failure_reasons_id_code` | `CREATE UNIQUE INDEX uq_logistics_delivery_failure_reasons_id_code ON logistics.delivery_failure_reasons USING btree (id, code)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_failure_reasons FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |
| `master_guard` | `CREATE TRIGGER master_guard BEFORE INSERT OR DELETE OR UPDATE ON logistics.delivery_failure_reasons FOR EACH ROW EXECUTE FUNCTION platform.guard_master()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON logistics.delivery_failure_reasons FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON logistics.delivery_failure_reasons FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `logistics.delivery_failure_reasons` |
| Category | Master / Reference — Controlled unsuccessful delivery reason vocabulary |
| Proposed owner / maintenance role | Delivery_Operations / Delivery Operations steward |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `logistics.delivery_attempts`, `logistics.ndr_cases` |
| Features | `DLV-03`, `RID-04`, `RID-06` |
| API consumers | [API-066](../../../05-APIs/Delivery_Operations.md), [API-073](../../../05-APIs/Rider_App.md), [API-074](../../../05-APIs/Rider_App.md) |

### Expected initial records

| Code | Name | Description | Status | Source | Additional schema attributes |
| --- | --- | --- | --- | --- | --- |
| RECIPIENT_UNAVAILABLE | Recipient unavailable | Operational reason/tag only; not a clinical, financial entitlement or automatic disposition rule. | Proposed | Existing reason-linked schema and relevant documented workflow | display_name=Recipient unavailable; is_active=true; sort_order=0 |
| ADDRESS_UNREACHABLE | Address unreachable | Operational reason/tag only; not a clinical, financial entitlement or automatic disposition rule. | Proposed | Existing reason-linked schema and relevant documented workflow | display_name=Address unreachable; is_active=true; sort_order=1 |

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deployment reference seed after approval, followed by controlled administration. |
| Create/update permissions | Delivery Operations steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (code); UNIQUE: UNIQUE (id, code); CREATE UNIQUE INDEX uq_logistics_delivery_failure_reasons_code ON logistics.delivery_failure_reasons USING btree (code); CREATE UNIQUE INDEX uq_logistics_delivery_failure_reasons_id_code ON logistics.delivery_failure_reasons USING btree (id, code) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Explicit rows above are Confirmed domain values or Proposed initial records, never observed production/seed data. No live row existence or seed execution was verified. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
