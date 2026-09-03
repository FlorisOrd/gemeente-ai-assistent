# Gemeente AI Assistent

**An embeddable, source-grounded AI assistant prototype for Dutch municipality websites.**

Municipal information can be difficult to find across large websites. This project explores a small chat widget that a municipality can embed while keeping approved sources, official contact routes and human authority central.

The repository currently provides a working local, multi-tenant prototype. It runs in mock mode without external services and can optionally call OpenAI from the server when `OPENAI_API_KEY` is configured. It is intended for private demos and staging preparation, not public production.

## What currently works

- A reusable browser widget selected through `data-tenant`, with tenant-specific public configuration, branding, contact links and allowed origins.
- A Node.js backend with `GET /api/config`, `POST /api/chat`, `GET /health` and `GET /ready`.
- Approved-source selection from tenant JSON files. Answers include source links; when no approved source matches, the assistant declines to guess and directs the visitor to official channels.
- A simple off-topic gate, empty and oversized-message validation, request-body limits, per-IP in-memory rate limiting and origin checks.
- Privacy-conscious interaction: the widget warns against sharing sensitive personal data, and structured server logs omit full messages, prompts, API keys, source summaries and raw provider responses.
- Accessibility-oriented interface patterns including semantic controls, keyboard focus handling, an `aria-live` message region and responsive sizing. These have not been formally audited on a real municipality website.
- Mock-mode smoke tests covering core configuration, source, validation, origin and health behaviour. GitHub Actions runs the smoke test and deployment-configuration check.

The assistant is informational. It does not make municipal decisions, and its interface tells visitors to verify official information or contact the municipality.

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

Mock mode is the default when `OPENAI_API_KEY` is absent. It exercises the full widget, tenant, approved-source and refusal flow without making an AI API call.

### Optional OpenAI mode

The browser still talks only to the backend; the key remains server-side. In PowerShell:

```powershell
$env:OPENAI_API_KEY = Read-Host "OpenAI API key"
node apps/server/server.js
```

The current implementation uses the OpenAI Responses API only when that environment variable is present. Claude, Claude Code and Claude Cowork were used in the development workflow; they are not the runtime provider.

Never commit an API key or place one in browser code, tenant files, demo pages or README examples.

## Tenant and source configuration

Tenant configuration lives in `apps/server/tenants/`. Public-safe fields include the municipality and assistant names, theme, button label, welcome message, widget position, contact and privacy links, allowed topics and allowed origins.

Approved source summaries live in `apps/server/knowledge/`. The current prototype uses readable keyword matching to select up to three relevant entries. In OpenAI mode, only those approved summaries are provided as answer context.

The same widget code is reused for every tenant. To create starter tenant and knowledge files:

```bash
node scripts/create-tenant.js nieuwegemeente
```

Generated files are templates only and must be edited and reviewed before use. See the [municipality integration guide](docs/municipality-integration-guide.md) and [tenant onboarding guide](docs/tenant-onboarding.md).

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
