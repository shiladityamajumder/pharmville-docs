# Database reference

The `healthcare_db` repository owns PostgreSQL schema and SQL migration history. Its SQL migrations are the deployment authority; historical Alembic execution is frozen. The local SQL directory is available, but the target deployment ledger and upstream release revision have not been verified. See [migration evidence](Migrations.md) before relying on catalog counts.

- [Schema overview](Schema-Overview.md)
- [Functions, triggers and row security](Database-Objects.md)
- [Relationships](Relationships.md)
- [Database rules and ownership](Database-Rules.md)
- [Migration history and evidence](Migrations.md)
- [ORM models and parity](Models-and-Parity.md)
- [Module mapping](Module-Mapping.md)
- [Table contracts by schema](Tables/)
