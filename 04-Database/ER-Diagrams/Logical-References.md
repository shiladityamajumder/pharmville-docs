# Logical and polymorphic references that are not foreign keys

## Why this list is separate

These UUID columns are classified by the database project's final reference register but do not have a declared PostgreSQL FK. They are intentionally excluded from ERD relationship lines and the physical FK count. Their use may be a provider/correlation identifier or a discriminator-based reference; do not treat the UUID as proof that a target row exists.

The source classification contains 35 formerly unbound UUID references. Six are classified as real domain relationships and are now present as physical FK pairs in the relationship catalog. The remaining **29** are listed below (10 provider/correlation references and 19 polymorphic references).

| Column | Classification | Discriminator | Recorded handling and limit |
|---|---|---|---|
| `clinical.prescription_access_logs.request_id` | provider/correlation ID | — | retain UUID; not an entity primary key Request correlation; not a patient/entity key |
| `compliance.evidence.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `customer.consent_events.request_id` | provider/correlation ID | — | retain UUID; not an entity primary key Request correlation preserved in consent history |
| `finance.journal_entries.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `identity.login_attempts.request_id` | provider/correlation ID | — | retain UUID; not an entity primary key Authentication request correlation |
| `identity.sessions.token_family_id` | provider/correlation ID | — | retain UUID; not an entity primary key Opaque security token-rotation family; never a user/table key |
| `identity.user_roles.scope_id` | polymorphic subject | `scope_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `insurance.claims.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `insurance.eligibility_checks.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `membership.benefit_usage.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `membership.loyalty_ledger.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `notification.messages.correlation_id` | provider/correlation ID | — | retain UUID; not an entity primary key Cross-service notification correlation |
| `platform.audit_logs.request_id` | provider/correlation ID | — | retain UUID; not an entity primary key Cross-service audit request correlation |
| `platform.file_access_events.request_id` | provider/correlation ID | — | retain UUID; not an entity primary key Private file access request correlation |
| `platform.file_access_grants.subject_id` | polymorphic subject | `subject_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `platform.file_objects.owner_id` | polymorphic subject | `owner_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `platform.inbox_messages.message_id` | provider/correlation ID | — | retain UUID; not an entity primary key Producer message UUID; uniqueness is scoped to consumer_name |
| `platform.outbox_events.aggregate_id` | polymorphic subject | `aggregate_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `platform.webhook_deliveries.event_id` | provider/correlation ID | — | retain UUID; not an entity primary key Producer event UUID; not assumed to originate in this outbox |
| `platform.webhook_endpoints.owner_id` | polymorphic subject | `owner_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `pricing.pricing_evaluations.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `risk.assessments.request_id` | provider/correlation ID | — | retain UUID; not an entity primary key Risk evaluation request correlation |
| `risk.assessments.subject_id` | polymorphic subject | `subject_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `risk.cases.subject_id` | polymorphic subject | `subject_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `risk.signals.subject_id` | polymorphic subject | `subject_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `search.documents.entity_id` | polymorphic subject | `entity_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `search.indexing_jobs.entity_id` | polymorphic subject | `entity_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `search.query_events.selected_entity_id` | polymorphic subject | `selected_entity_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |
| `warehouse.stock_ledger.reference_id` | polymorphic subject | `reference_type` | retain public UUID plus discriminator; runtime roles deny direct writes. Trusted allowlist validates owned order/patient/prescription targets; unsupported kinds stay disabled until their domain service supplies ownership checks. No invented single-parent FK  |

## Historical ORM relationships

Legacy models are privately archived and are not a second schema authority. The earlier source scan found no SQLAlchemy navigation declarations. ERDs derive physical relationships exclusively from the validated standalone SQL catalog.

## Tables with no declared foreign keys

- [`platform.report_definitions`](../Tables/platform/report_definitions.md) — no FK constraint appears in the verified catalog snapshot. This is a review observation, not a claim that the design is wrong.

The schema catalog does not establish whether every logical association is approved for enforcement. Review the database source's reference classification and service ownership before proposing new constraints. Do not draw these relationships as verified FKs.
