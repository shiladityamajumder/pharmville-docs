# Customer Accounts edge cases

These cases define expected technical behavior for the proposed customer account contracts. Business policy values such as OTP expiry and deletion retention remain in [Sources and decisions](../../09-References/Sources-and-Decisions.md).

| Case ID | Feature | Scenario | Expected behavior | Data impact | Recovery | Test ID |
| --- | --- | --- | --- | --- | --- | --- |
| `EC-ACC-01-01` | `ACC-01` | Malformed phone number | Reject before challenge creation; return field validation without account lookup disclosure. | No identity or challenge change. | Correct number and retry. | `TC-ACC-01-02` |
| `EC-ACC-01-02` | `ACC-01` | OTP delivery provider times out | Keep delivery pending/failed; do not report delivery success. Apply configured fallback only once. | Challenge is recorded with delivery outcome. | Retry delivery using provider idempotency where available. | `TC-ACC-01-04` |
| `EC-ACC-01-03` | `ACC-01` | OTP expired, incorrect, consumed, or superseded | Reject without session creation; return generic safe error. | Challenge attempt/status updated; no session. | Request a new challenge subject to configured limits. | `TC-ACC-01-03` |
| `EC-ACC-01-04` | `ACC-01` | Repeated requests or guesses from one phone/IP | Enforce configured limits and return `429`; avoid account enumeration. | Rate-limit/security event only. | Retry after policy window; support can inspect redacted event IDs. | `TC-ACC-01-05` |
| `EC-ACC-01-05` | `ACC-01` | Two verification requests race on the same valid code | At most one verification consumes the challenge and creates a session. | One challenge consumption and one session maximum. | Client uses the returned session or requests a new challenge. | `TC-ACC-01-05` |
| `EC-ACC-02-01` | `ACC-02` | Customer submits another user's ID or accesses another profile | Derive owner from session; return `404` or `403` without confirming account existence. | No change. | Retry against own profile. | `TC-ACC-02-02` |
| `EC-ACC-02-02` | `ACC-02` | Email/phone conflicts with another account | Return `409`; do not partially update profile or identity. | Transaction rolls back. | Use a verified contact that is not already assigned. | `TC-ACC-02-03` |
| `EC-ACC-02-03` | `ACC-02` | Contact changed but verification is incomplete | Preserve the existing verified contact; verify the replacement with the D-023 proof contract before committing it. | No verified identity change; pending-proof storage needs D-023. | Complete verification or discard the pending change. | `TC-ACC-02-04` |
| `EC-ACC-02-04` | `ACC-02` | Two profile edits use the same row version | First valid write succeeds; stale write returns `409`. | No lost update. | Reload profile and resubmit intended fields. | `TC-ACC-02-02` |
| `EC-ACC-02-05` | `ACC-02` | Partial PATCH omits an existing field | Preserve omitted value; only explicit allowed `null` clears nullable fields. | Only supplied columns change. | Correct the request and retry. | `TC-ACC-02-01` |
| `EC-ACC-03-01` | `ACC-03` | Address belongs to a different customer | Reject; composite ownership check prevents default-address linkage across users. | No address/profile change. | Select or create an address owned by caller. | `TC-ACC-03-DENY` |
| `EC-ACC-03-02` | `ACC-03` | Serviceability provider is unavailable | Save valid address if the operation is address-only; mark serviceability unknown and prevent checkout from treating unknown as serviceable. | Address may persist; no false serviceability result. | Retry lookup when provider recovers. | `TC-ACC-03-DENY` |
| `EC-ACC-04-01` | `ACC-04` | Customer tries to attach another household's patient to an order | Deny association before prescription/order processing. | No patient or order association change. | Select an owned patient or resolve access under approved policy. | `TC-ACC-04-DENY` |
| `EC-ACC-05-01` | `ACC-05` | Consent version is missing or stale | Do not record consent to a different version; show current notice and capture explicit choice. | No consent grant. | Present current version and record a new explicit action. | `TC-ACC-05-DENY` |
| `EC-ACC-06-01` | `ACC-06` | Deletion requested while retention/legal hold applies | Acknowledge request and route to review; do not delete held records or claim completion. | Request state and audit event only. | Complete after authorized retention review. | `TC-ACC-06-DENY` |
| `EC-ACC-07-01` | `ACC-07` | Wishlist item is submitted twice | Enforce idempotent/unique item behavior; return current item state. | One item per approved uniqueness rule. | No user action required. | `TC-ACC-07-DENY` |

All tests are design cases and are not reported as executed. Cross-feature session and ownership requirements are in [Security](../../07-Engineering/Security.md).
