# Database reference

- [Entity relationship diagrams](ER-Diagrams/README.md) — verified domain diagrams, FK catalog, and evidence limits.

<!-- ERD-INDEX-LINK -->


The user-supplied `healthcare_db` folder owns the PostgreSQL schema and SQL migration history used by this documentation. Its SQL migrations are the deployment authority; historical Alembic execution is frozen. Source checksums and catalog counts are verified against this supplied folder.

The target deployment ledger and live runtime parity remain separate checks. See [migration evidence](Migrations.md).

- [Schema overview](Schema-Overview.md)
- [Functions, triggers and row security](Database-Objects.md)
- [Relationships](Relationships.md)
- [Database rules and ownership](Database-Rules.md)
- [Migration history and evidence](Migrations.md)
- [ORM models and parity](Models-and-Parity.md)
- [Module mapping](Module-Mapping.md)
- [Table contracts by schema](Tables/)

## Master-data planning

[Master-data inventory](Master-Data-Inventory.md) classifies all 266 tables and links 44 master lifecycle/record plans. Eleven have explicit Confirmed/Proposed initial-value lists; 33 require owner-supplied datasets. No seeds or migrations changed.
