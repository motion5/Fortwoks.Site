<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (initial ratification)

Principles defined:
  I.   BFF Boundary
  II.  API Security
  III. Resilience and Failover
  IV.  Cache-First Menu Strategy
  V.   Payment Before Submission
  VI.  Scale-Ready Single-Site

Added sections:
  - Core Principles (6 principles)
  - Technology Stack & Scope
  - Open Questions & Decision Log
  - Governance

Templates checked:
  ✅ plan-template.md — Constitution Check section compatible;
     gates will validate against all 6 principles
  ✅ spec-template.md — user story structure compatible;
     FR markers can reference principle IDs (P-I through P-VI)
  ✅ tasks-template.md — phase structure accommodates
     foundational tasks for BFF, Stripe, Andromeda integration

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Pending formal project kickoff
  - TODO(API_SCHEMAS): Andromeda API docs access pending;
    expect MINOR bump when schemas replace inferred endpoints
  - TODO(AUTH_APPROACH): Customer auth provider decision pending
  - TODO(INFRASTRUCTURE): Hosting decision pending
-->

# Fortwoks Site Constitution

## Core Principles

### I. BFF Boundary

The .NET backend is a thin proxy and orchestrator — not a
business logic engine. It MUST:

- Cache menus retrieved from Andromeda
- Handle the Stripe payment lifecycle (create intent, capture,
  refund)
- Manage customer accounts (registration, login, sessions)
- Submit validated, paid orders to Andromeda
- NEVER duplicate business logic that belongs in Andromeda
  (pricing, menu rules, promo calculations, order routing)

The SvelteKit frontend MUST handle presentation and
client-side cart state only. It MUST NOT call Andromeda or
Stripe directly.

**Rationale**: Andromeda is the system of record for menu
content, pricing, and order fulfilment. Duplicating that logic
creates drift, bugs, and maintenance burden. The BFF exists
to bridge the browser to Andromeda securely.

### II. API Security

All communication with Andromeda API and Stripe MUST occur
server-side only. Non-negotiable rules:

- API keys, Application IDs, and secrets MUST NEVER be sent
  to or accessible from the browser
- Stripe card data MUST be handled exclusively through Stripe
  Elements — the system MUST NEVER touch raw card numbers
- The BFF MUST validate and sanitise all data crossing the
  browser-to-server boundary before forwarding to external APIs
- CORS, CSP, and rate limiting MUST be configured to restrict
  frontend-to-BFF communication to expected origins and patterns

**Rationale**: PCI compliance requires card data isolation via
Stripe Elements. Andromeda credentials leaked client-side would
expose the POS system. Defence in depth at the BFF boundary.

### III. Resilience and Failover

The Andromeda API uses a signpost server pattern with multiple
API endpoints. The BFF MUST:

- Implement endpoint discovery via the signpost server
- Automatically fail over across available servers when one
  is unreachable
- Degrade gracefully when all Andromeda endpoints are
  unavailable (display "ordering temporarily unavailable"
  rather than crash or show stack traces)
- Use cached menu data to maintain read availability during
  Andromeda outages
- Log all failover events with enough context to diagnose
  issues post-incident

**Rationale**: A takeaway business loses revenue for every
minute the ordering system is down. Signpost-based failover
and menu caching provide resilience against Andromeda
infrastructure issues outside our control.

### IV. Cache-First Menu Strategy

Menus MUST be fetched from Andromeda and cached locally in the
BFF. Cache invalidation rules:

- The `menuVersion` field from `GetSites` MUST be used to
  detect staleness
- Menus MUST only be re-fetched when the version changes
- Cached menus MUST be served when Andromeda is temporarily
  unreachable
- Cache TTL and refresh strategy MUST be configurable without
  code changes
- The system MUST NOT serve a menu older than a configurable
  maximum age (default: 24 hours) without a staleness warning

**Rationale**: Reduces API calls to Andromeda, improves page
load times, and provides availability during outages. Menu
changes are infrequent (daily at most) so version-based
invalidation is sufficient.

### V. Payment Before Submission

Payment MUST succeed before an order is submitted to
Andromeda. The critical flow is:

1. Validate order (items, availability, delivery address)
2. Create Stripe PaymentIntent server-side
3. Capture payment via Stripe
4. Submit order to Andromeda
5. Return order reference to customer

Edge case handling:

- If payment succeeds but Andromeda rejects the order, the
  system MUST either initiate an automatic refund or flag the
  order for manual review — NEVER silently drop it
- The system MUST NEVER submit an unpaid order to Andromeda
- Payment and submission MUST be logged as a correlated
  transaction for audit and debugging

**Rationale**: Submitting unpaid orders creates financial loss.
The payment-first flow ensures Andromeda only receives orders
the business has already been paid for. The refund/flag
mechanism handles the unavoidable race condition.

### VI. Scale-Ready Single-Site

Architecture MUST target a single physical site initially but
MUST NOT make decisions that prevent multi-site later:

- Site-specific data (menus, delivery radius, opening hours)
  MUST be keyed by site ID — NEVER hardcoded or assumed
  singular
- Customer accounts MUST be site-aware (a customer may order
  from multiple sites)
- The BFF MUST accept a site identifier in all site-scoped
  API calls
- The frontend MUST support site selection (even if initially
  auto-selected or hidden for a single-site deployment)
- Database schemas, cache keys, and configuration MUST use
  site ID as a dimension

**Rationale**: Andromeda's data model is already per-site.
Building site-awareness from day one avoids a painful
migration when the client expands. The cost of parameterising
by site ID is negligible compared to retrofitting it later.

## Technology Stack & Scope

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | SvelteKit (Svelte 5), TypeScript strict, SSR |
| Payments (client) | Stripe Elements (card, Apple Pay, Google Pay) |
| Backend (BFF) | C# / .NET 8+, minimal API or controllers |
| Andromeda integration | ACS Web Ordering API (signpost pattern) |
| Payments (server) | Stripe PaymentIntents, webhook verification |
| Infrastructure | TBD (see Open Questions) |

### In Scope (We Build)

- Menu display: categories, items, modifiers, deals, allergens
- Cart/basket with item customisation (sizes, toppings, extras)
- Customer accounts: registration, login, saved addresses,
  order history
- Checkout: delivery address entry + validation, collection
  option, time selection
- Stripe payment integration (full flow)
- Order submission to Andromeda API
- Delivery/collection toggle with address validation against
  site delivery radius
- Site online/offline awareness

### Out of Scope (Andromeda Handles)

- Order confirmation emails
- Order tracking / Domino's-style tracker
- Kitchen display / chef and packer screens
- Driver management and GPS tracking
- Menu content management (Andromeda portal)
- Promo codes / discount management (Andromeda portal; API
  pass-through needs verification)

## Open Questions & Decision Log

The following are unresolved. Specs and plans MUST ask rather
than assume answers:

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Andromeda API auth mechanism (API key / OAuth / Bearer) | Pending docs access |
| OQ-2 | Full API request/response JSON schemas | Pending docs access |
| OQ-3 | Andromeda webhooks for order status vs polling | Unknown |
| OQ-4 | Delivery radius validation (API-side or client geo) | Undecided |
| OQ-5 | Scheduled/future order support in API | Unknown |
| OQ-6 | Promo code API pass-through support | Needs verification |
| OQ-7 | Customer auth approach (custom vs Auth0/Clerk/Supabase) | Undecided |
| OQ-8 | Hosting/infrastructure decision | Undecided |
| OQ-9 | Domain name | Undecided |
| OQ-10 | Branding and design direction | Undecided |
| OQ-11 | Replace fortwoks.com or new domain | Undecided |

When an open question is resolved, update the Status column
and record the decision. Expect a MINOR version bump when
Andromeda API schemas are obtained (OQ-1, OQ-2).

## Governance

This constitution is the authoritative reference for
architectural decisions on the Fortwoks Site project. All
specs, plans, and implementations MUST comply.

### Amendment Procedure

1. Propose the change with rationale in a PR or conversation
2. Evaluate version bump:
   - **MAJOR**: Principle removal, redefinition, or backward-
     incompatible governance change
   - **MINOR**: New principle/section added, materially
     expanded guidance, or API schema integration
   - **PATCH**: Clarifications, wording, typo fixes
3. Update constitution, bump version, set LAST_AMENDED_DATE
4. Propagate changes to dependent templates (plan, spec,
   tasks) and document in Sync Impact Report

### Compliance Review

- Every `/speckit-plan` run MUST include a Constitution Check
  gate validating against all 6 principles
- Every `/speckit-specify` output MUST reference applicable
  principles in functional requirements
- Violations MUST be justified in the Complexity Tracking
  table or resolved before proceeding

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Pending formal project kickoff | **Last Amended**: 2026-02-23
