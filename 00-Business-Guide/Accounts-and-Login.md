# Accounts and login

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

An account keeps a customer’s addresses, family details, wishlist and order history together. Signing in proves identity; access to a particular patient or staff action is checked separately.

## Who is involved?

Customers, authorized family-account holders, staff, Security and support.

## How does it normally work?

1. The customer enters a mobile number and reads the current privacy notice. Pharmville records explicit consent choices against that version of the notice.
2. A one-time code is sent through the configured WhatsApp route, with SMS fallback under the approved rule. A valid unused code permits sign-in.
3. A new customer supplies the required profile name. A verified number alone must not create a made-up completed profile. Permissions during incomplete signup need approval.
4. The customer maintains their profile, saved addresses, map pins, authorized dependents and wishlist. Delivery availability is checked separately for each order.
5. Staff sign in using their role’s approved method. The draft privileged-role policy requires password and authenticator verification; customer OTP alone must not unlock those roles.
6. Deletion requests go to privacy review. The customer is told whether the request is pending or complete; required financial or clinical evidence is not silently erased.

## What happens next?

The customer continues to [product discovery](Catalog-and-Product-Discovery.md) or [checkout](Cart-and-Checkout.md).

## What can go wrong, and what does the system do?

### The code is wrong, expired or entered twice

A typing error, delay or second browser tab can cause this. Pharmville refuses invalid proof and creates at most one session from a code. The customer sees a safe verification message and can request another code within approved limits; Security handles abuse.

### No code arrives

The provider or mobile connection may fail. Delivery stays pending or failed and only the approved fallback is used. The customer can retry when allowed or contact support; support cannot bypass identity proof.

### A contact change or patient link is unsafe

A replacement number may be unverified or a dependent may belong to another household. Pharmville preserves the verified contact and refuses unauthorized links. The customer sees a verification/access explanation; Security resolves legitimate recovery using approved proof.

### Two edits or a retention hold interrupt the request

Competing profile edits require the stale device to reload, preserving the accepted edit. A deletion blocked by legal retention stays in review rather than completed. The customer resolves edit conflicts; Privacy owns retention review and protects the retained records.

## What does the user see?

Customers see code delivery/verification, incomplete signup, saved details and deletion-review status. Staff see only actions allowed by their current role and location.

## What still needs approval?

D-003 (login), D-013 (consent and retention), D-023 (contact changes). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Customer Accounts | [HLD](../03-Modules/Customer-Accounts/HLD.md) | [LLD](../03-Modules/Customer-Accounts/LLD.md) | [API](../03-Modules/Customer-Accounts/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#customer-accounts) | [Cases](../03-Modules/Customer-Accounts/Edge-Cases.md) |
| Authentication Access | [HLD](../03-Modules/Authentication/HLD.md) | [LLD](../03-Modules/Authentication/LLD.md) | [API](../03-Modules/Authentication/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#authentication-access) | [Cases](../03-Modules/Authentication/Edge-Cases.md) |

Technical workflows: [WF-001](../06-Workflows/WF-001-Identity-and-Session.md).

Feature references: `ACC-01`, `ACC-02`, `ACC-03`, `ACC-04`, `ACC-05`, `ACC-06`, `ACC-07`, `AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)


## Unified identity and workspace access

**Proposed / Unapproved / Not Implemented — D-003/D-024/D-028.** [Unified Identity policy](../03-Modules/Authentication/Unified-Identity-Architecture.md) is the canonical authentication, scoped authorization, context-switch, step-up and revocation design. [Role/workspace matrix](../01-Project/User-Roles.md) defines proposed defaults without granting permissions. Customer and Rider phone OTP and AUTH-01 password/authenticator requirements remain. Account, role and panel are separate: menus and client role strings never authorize an API. No grant means account access only; suspension/expiry deny protected operations. Existing service identities/provider signatures remain separate trust types.
