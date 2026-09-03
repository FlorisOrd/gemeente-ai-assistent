# Gemeente AI Assistent

**A Claude-assisted, source-grounded AI assistant prototype for Dutch municipality websites.**

> **Development and runtime are separate.** Claude, Claude Code and Claude Cowork were the primary AI collaborators used to shape, implement and review this project. The currently committed optional server adapter calls the OpenAI Responses API when `OPENAI_API_KEY` is configured; mock mode requires no external model provider. This repository does not claim Claude API runtime integration.

Municipal information can be difficult to find across large websites. This project explores a small, embeddable assistant that helps visitors navigate approved municipal information while keeping official sources, human contact routes and municipal authority central.

The repository currently provides a working local, multi-tenant prototype. It is suitable for private demonstrations and staging preparation, not public production.

## Why this project exists

A useful public-service assistant should do more than produce plausible text. It should:

- answer from reviewed municipal material;
- show the sources used;
- decline to guess when approved information is unavailable;
- avoid asking for sensitive personal data;
- preserve access to official human channels;
- remain understandable, testable and controllable by the municipality.

The prototype turns those principles into a small widget, backend and tenant configuration model that can be examined without a build system, database or package installation.

## What currently works

- A reusable browser widget selected through `data-tenant`, with tenant-specific public configuration, branding, contact links and allowed origins.
- A Node.js backend with `GET /api/config`, `POST /api/chat`, `GET /health` and `GET /ready`.
- Approved-source selection from tenant JSON files. Answers include source links; when no approved source matches, the assistant declines to guess and directs the visitor to official channels.
- A simple off-topic gate, empty and oversized-message validation, request-body limits, per-IP in-memory rate limiting and origin checks.
- Privacy-conscious interaction: the widget warns against sharing sensitive personal data, and structured server logs omit full messages, prompts, API keys, source summaries and raw provider responses.
- Accessibility-oriented interface patterns including semantic controls, keyboard focus handling, an `aria-live` message region and responsive sizing. These have not been formally audited on a real municipality website.
- Mock-mode smoke tests covering core configuration, source, validation, origin and health behaviour. GitHub Actions runs the smoke test and deployment-configuration check.

The assistant is informational. It does not make municipal decisions, and its interface tells visitors to verify official information or contact the municipality.

## How Claude supported the work

Claude, Claude Code and Claude Cowork were used as development collaborators across the project lifecycle, including:

- turning product goals into bounded requirements and acceptance criteria;
- exploring the multi-tenant widget and backend architecture;
- decomposing implementation and documentation work;
- reviewing privacy, safety, accessibility and operational risks;
- drafting and checking tests, runbooks and review materials;
- challenging generated work against repository evidence rather than accepting it because it appeared plausible.

Claude-assisted work remained subject to human review. Product scope, architecture, testing expectations, deployment decisions and consequential safety choices remained my responsibility.

## Run locally

No packages need to be installed; the server uses built-in Node.js features.

```bash
node apps/server/server.js
```

Then open:

```text
http://localhost:3000/demo/demo.html
```

Additional local examples:

```text
http://localhost:3000/demo/waterstad.html
http://localhost:3000/demo/staging-embed.html
```

### Mock mode

Mock mode is the default when `OPENAI_API_KEY` is absent. It exercises the widget, tenant configuration, approved-source selection, refusal behaviour and source-link flow without making an external AI API call.

### Optional hosted-model adapter

The browser still talks only to the backend; the API key remains server-side. In PowerShell:

```powershell
$env:OPENAI_API_KEY = Read-Host "OpenAI API key"
node apps/server/server.js
```

The current server implementation uses that variable to call the OpenAI Responses API. This is the repository's present runtime adapter, not the focus of the product design and not evidence of Claude API integration.

Never commit an API key or place one in browser code, tenant files, demo pages or README examples.

## Request and answer flow

1. A page loads `widget/widget.js` with a tenant identifier.
2. The widget requests public-safe configuration from `GET /api/config`.
3. The visitor submits a question to `POST /api/chat`.
4. The backend checks the origin, message shape, length, topic gate and rate limit.
5. The backend searches the tenant's approved knowledge entries.
6. If no approved source matches, the assistant declines to guess and returns an official contact route.
7. If a source matches, mock mode returns a transparent demonstration response; the optional hosted-model adapter can instead answer from the approved summaries.
8. The widget displays the response, mode label and source links.

## Tenant and source configuration

Tenant configuration lives in `apps/server/tenants/`. Public-safe fields include the municipality and assistant names, theme, button label, welcome message, widget position, contact and privacy links, allowed topics and allowed origins.

Approved source summaries live in `apps/server/knowledge/`. The current prototype uses readable keyword matching to select up to three relevant entries. When the optional hosted-model adapter is active, only those approved summaries are supplied as answer context.

The same widget code is reused for every tenant. To create starter tenant and knowledge files:

```bash
node scripts/create-tenant.js nieuwegemeente
```

Generated files are templates only and must be edited and reviewed before use. See the [municipality integration guide](docs/municipality-integration-guide.md) and [tenant onboarding guide](docs/tenant-onboarding.md).

## Safeguards in the prototype

The current safeguards are intentionally simple and inspectable:

- allowlisted website origins per tenant;
- browser-safe public configuration separated from server-side secrets;
- maximum message and request-body sizes;
- an in-memory per-IP rate limit;
- a basic municipal-topic gate;
- approved-source-only answer context;
- refusal when no approved source is found;
- warnings not to share BSN, medical data or other sensitive information;
- response-token limits and disabled provider-side response storage in the current adapter;
- structured operational logs that avoid citizen messages and raw model output;
- visible reminders that the assistant does not make official decisions.

These controls reduce obvious prototype risks but are not a substitute for production security, privacy, accessibility, content-governance or legal review.

## Validation and staging checks

Run the local backend smoke test:

```bash
node scripts/smoke-test.js
```

Check tenant deployment configuration:

```bash
node scripts/check-deployment-config.js
```

After a hosted staging deployment is reachable:

```bash
BASE_URL=https://assistant.example.nl node scripts/check-hosted-deployment.js
```

The hosted check covers health, readiness, staging configuration, chat and blocked-origin behaviour. It does not deploy the application.

## Design, risk and operations notes

- [Accessibility checklist](docs/accessibility-checklist.md)
- [Privacy, security and AI-risk review pack](docs/privacy-security-review-pack.md)
- [Deployment notes](docs/deployment.md)
- [Operations notes](docs/operations.md)
- [Current limitations](docs/current-limitations.md)

These materials support review and pilot preparation; they are not legal advice, formal compliance evidence or security certification.

## Current limitations

- The approved-source layer is a small JSON and keyword-matching prototype, not a production retrieval or content-governance system.
- The rate limiter is in memory and applies only to one server process.
- There is no authentication, database, persistent feedback service, monitoring dashboard or public production deployment.
- The repository contains synthetic example tenants; it does not evidence a real municipality pilot or municipal users.
- There has been no formal accessibility audit, DPIA/GEB, legal sign-off, security certification or measured accuracy evaluation.
- Production use would require reviewed official content, stronger rate limiting, monitoring and alerting, operational ownership, security and privacy review, accessibility testing and deployment hardening.

## My role and development approach

I owned the product requirements, prompting strategy, architecture, task decomposition, acceptance criteria, testing, deployment decisions and coordination of coding agents. I used Claude, Claude Code and Claude Cowork as development collaborators, reviewed generated work and retained responsibility for consequential product and safety decisions.
