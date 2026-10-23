# Database functions, triggers, and row security

The checked-in schema report counts 56 functions and 879 triggers. The table contract for each entity lists its recorded triggers. These figures describe the local report and must be interpreted within the local evidence limits in [Migrations](Migrations.md).

## Where to find definitions

| Object | Source in `healthcare_db` | Notes |
|---|---|---|
| Deployment DDL | `postgresql/migrations/` | Ordered SQL migrations are the deployment authority. |
| Shared workflow functions and triggers | `app/db/workflow.sql`, `app/db/operations_workflow.sql`, `app/db/eligibility_workflow.sql`, `app/db/domain_workflow.sql`, `app/db/report_workflow.sql`, `app/db/upgrade_workflow.sql` | Companion workflow contract files; use the migrations to establish deployed definitions. |
| Numeric key maintenance | `app/db/numeric_keys.sql`, `app/db/numeric_keys.py` | Maintains internal numeric keys alongside public UUIDs. |
| RLS helpers and policies | `app/db/security.sql` | Contains customer order/item reads and scoped staff stock reads. |
| ORM declarations | `app/models/` | SQLAlchemy metadata is checked against the migrated database; it is not a second migration history. |

The checked-in security contract defines `customer_own_order`, `customer_own_item`, and `staff_warehouse_stock` policies. It uses `platform.authenticated_customer()` for customer scope and `platform.can_read_warehouse()` for staff stock scope. RLS applies only to enabled tables with policies; it does not replace service authorization or protect every table automatically.

Table triggers maintain record versions, public/internal key pairs, controlled reason codes, append-only records, or workflow gates where configured. Keep side effects and permission checks explicit in the service transaction. Do not assume every function or trigger is active in a deployed environment until the intended migration history is verified.
