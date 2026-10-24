# `diagnostics.sample_events`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds sample events records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 9 columns, 6 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_sample_events_actor_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `event_type` | `character varying(64)` | No | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `location` | `character varying(255)` | Yes | — | Inferred: stores location for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `sample_id` | `uuid` | No | — | Reference linking this record to samples | Ensures related business data can be joined and validated | FK → `diagnostics.samples` (fk_diagnostics_sample_events_sample_id_samples) |
| `sample_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.samples` (fk_diagnostics_sample_events_sample_id_samples_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the sample events business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.sample_events` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_diagnostics_sample_events_actor_user_id_users`; `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `sample_id` → `diagnostics.samples(id)` via `fk_diagnostics_sample_events_sample_id_samples`; `FOREIGN KEY (sample_id) REFERENCES diagnostics.samples(id) ON DELETE CASCADE`
- `sample_id_internal_id` → `diagnostics.samples(internal_id)` via `fk_diagnostics_sample_events_sample_id_samples_numeric`; `FOREIGN KEY (sample_id_internal_id) REFERENCES diagnostics.samples(internal_id) ON DELETE CASCADE`

## `diagnostics.sample_events` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 9 columns, 6 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_diagnostics_sample_events_actor_user_id_users` |
| `sample_id` | `diagnostics.samples` | `fk_diagnostics_sample_events_sample_id_samples` |
| `sample_id_internal_id` | `diagnostics.samples` | `fk_diagnostics_sample_events_sample_id_samples_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_sample_events_numeric_pair_sample_id` | CHECK | `CHECK ((sample_id IS NULL) = (sample_id_internal_id IS NULL))` |
| `fk_diagnostics_sample_events_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_sample_events_sample_id_samples` | FOREIGN KEY | `FOREIGN KEY (sample_id) REFERENCES diagnostics.samples(id) ON DELETE CASCADE` |
| `fk_diagnostics_sample_events_sample_id_samples_numeric` | FOREIGN KEY | `FOREIGN KEY (sample_id_internal_id) REFERENCES diagnostics.samples(internal_id) ON DELETE CASCADE` |
| `pk_diagnostics_sample_events` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_sample_events_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_sample_events_sample_time` | `CREATE INDEX ix_diagnostics_sample_events_sample_time ON diagnostics.sample_events USING btree (sample_id, created_at)` |
| `pk_diagnostics_sample_events` | `CREATE UNIQUE INDEX pk_diagnostics_sample_events ON diagnostics.sample_events USING btree (internal_id)` |
| `uq_diagnostics_sample_events_id` | `CREATE UNIQUE INDEX uq_diagnostics_sample_events_id ON diagnostics.sample_events USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.sample_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["sample_id","sample_id_internal_id","diagnostics","samples"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON diagnostics.sample_events FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.sample_events FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["sample_id","sample_id_internal_id","diagnostics","samples"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
