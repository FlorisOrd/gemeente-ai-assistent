# Gemeente AI Assistent

This project is the first working mock version of an embeddable AI assistant widget for Dutch municipality websites.

The long-term idea is simple: a municipality can add one HTML snippet to its website, and visitors get a small assistant that can help them find municipal information.

Example of the future embed snippet:

```html
<script src="https://example.com/widget.js" data-tenant="demo"></script>
```

## What is included now

- Demo HTML pages that show how the widget could be embedded for different tenants.
- A widget script that creates a floating chat button and panel.
- A very small backend server with a `POST /api/chat` endpoint.
- A public `GET /api/config?tenant=demo` endpoint for browser-safe tenant configuration.
- Optional server-side OpenAI support when `OPENAI_API_KEY` is set.
- Basic MVP guardrails for validation, privacy, rate limiting, and cost control.
- Tenant configs for `demo`, `waterstad`, and `staging`.
- Documentation for the planned architecture, privacy principles, and MVP scope.

## What is not included yet

- No AI API calls unless `OPENAI_API_KEY` is set on the server.
- No real API keys.
- No build step.
- No npm, Docker, database, or authentication required.

## Try the demo

This version has a tiny server so the widget can send a message to `/api/chat`.

No packages need to be installed. The server uses only built-in Node.js features.

### Mock Mode

Mock mode is the default. It works when `OPENAI_API_KEY` is not set.

Run:

```bash
node apps/server/server.js
```

Then open:

```text
http://localhost:3000/demo/demo.html
```

You can also open the second fake municipality tenant:

```text
http://localhost:3000/demo/waterstad.html
```

And the staging embed simulation:

```text
http://localhost:3000/demo/staging-embed.html
```

The flow is:

1. The demo page loads `widget/widget.js`.
2. The widget reads `data-tenant="demo"`.
3. The widget loads public tenant configuration from `GET /api/config?tenant=demo`.
4. The visitor types a message.
5. The widget sends the message to `POST /api/chat`.
6. The server loads `apps/server/tenants/demo.json`.
7. The server returns a fake Dutch assistant response.
8. The widget shows the response and mock source links.

### Real OpenAI Mode

Real OpenAI mode is optional. The browser still talks only to this backend. The API key stays on the server.

In PowerShell, set the environment variable without typing it into any project file:

```powershell
$env:OPENAI_API_KEY = Read-Host "OpenAI API key"
node apps/server/server.js
```

Then open:

```text
http://localhost:3000/demo/demo.html
```

Never commit a real API key. Do not put keys in `widget.js`, `demo.html`, tenant config, README examples, or any file that is committed to git.

`.env.example` shows the variable name only. It is a placeholder, not a real key.

## Tenant Configuration

The widget now loads public tenant configuration from the backend.

Each tenant config controls:

- Municipality name.
- Assistant name.
- Theme color.
- Privacy link.
- Contact link.
- Allowed topics.
- Allowed website origins.
- Mock source links.

Only public-safe fields are returned to the browser. The OpenAI API key stays server-side and is never included in `GET /api/config`, `widget.js`, or `demo.html`.

Tenants now include `allowedOrigins`. This helps prevent random websites from using another municipality's tenant. The demo tenant allows localhost for local testing. Production tenants should list only the real municipality website origins, such as `https://www.gemeente-demo.nl`.

The same widget code is reused for each tenant. The tenant is selected with `data-tenant`, for example `data-tenant="demo"` or `data-tenant="waterstad"`.

## Safety Guardrails

This project now includes a few basic guardrails:

- Empty messages are rejected.
- Messages longer than 1000 characters are rejected.
- Very large request bodies are rejected.
- `/api/chat` has a simple in-memory per-IP rate limit: 10 messages per 5 minutes.
- `/api/chat` and `/api/config` check the request `Origin` against the tenant allowlist.
- `/api/chat` has a simple MVP topic gate that rejects clearly off-topic questions before mock mode or OpenAI runs.
- OpenAI responses are capped with a small max output token setting.
- OpenAI calls request no response storage.
- The widget warns visitors not to share BSN, medical data, or other sensitive personal data.
- The server avoids logging full citizen messages.

These guardrails are useful for the MVP, but they are not enough for public production use. A real deployment should add production-grade rate limiting, monitoring, privacy review, security review, and approved municipal content sources.

To test the rate limit manually, start the server and send more than 10 chat messages within 5 minutes from the same browser. The widget should show a friendly Dutch message asking you to wait a few minutes.

The topic gate is keyword-based and not perfect. It checks the demo tenant's allowed topics plus common municipality words, and rejects obvious off-topic examples such as recipes, football, films, programming help, and relationship advice. A production version should use a stronger policy layer and/or an approved municipal knowledge base.

## Approved Knowledge Sources

The assistant now uses simple approved source files in `apps/server/knowledge`.

Each tenant can have a matching JSON file with approved source titles, links, keywords, and short summaries. The MVP uses keyword matching to find 1 to 3 relevant sources for a visitor question.

If no approved source is found, the assistant should not guess. It returns a friendly Dutch message saying that no approved municipal information is available yet and points the visitor to the official contact page.

When OpenAI mode is enabled, the backend sends only the relevant approved summaries to OpenAI and asks it to answer only from those summaries. The browser does not receive secret prompts or API keys.

For production, replace this with a stronger approved content pipeline, search system, or retrieval system that is reviewed by the municipality.

## Widget Trust and Feedback

The widget now shows a short disclaimer explaining that it is an AI assistant, that it does not make decisions, and that visitors should check official municipal information.

Sources under answers are labeled with `Gebruikte bron(nen):`, and each answer shows a friendly status label such as `Demo-antwoord`, `Buiten onderwerp`, or `Geen goedgekeurde bron gevonden`.

The `Nuttig` and `Niet nuttig` buttons are local-only for now. They update the page to thank the visitor, but they do not send feedback to the server, store data, or collect personal data.

The `Gesprek wissen` button only clears the visible browser conversation and restores the intro message. It does not call the server.

## Municipality Integration Package

The repo now includes practical pilot materials for a municipality or website manager:

- `docs/municipality-integration-guide.md`
- `docs/pilot-checklist.md`
- `demo/embed-snippet.html`

These explain the embed snippet, tenant selection, `data-api-base`, allowed origins, approved sources, privacy expectations, and pilot checks.

## Tenant Onboarding

The repo includes starter templates and a generator for adding a future municipality tenant:

- `templates/`
- `scripts/create-tenant.js`
- `docs/tenant-onboarding.md`
- `docs/pilot-intake-form.md`

Create starter files with:

```bash
node scripts/create-tenant.js nieuwegemeente
```

The generated tenant and knowledge files must be edited and reviewed before use. The script never creates or asks for API keys.

## Privacy, Security, And AI-Risk Review

The repo includes practical, non-legal review materials for future municipality pilots:

- `docs/privacy-security-review-pack.md`
- `docs/risk-register.md`
- `docs/dpia-input-notes.md`
- `docs/ai-transparency-note.md`
- `docs/source-review-process.md`

Use these documents to discuss privacy, security, approved sources, AI transparency, known MVP limitations, and pilot boundaries before sharing the assistant with visitors. They are preparation materials only and are not legal advice.

## Run Smoke Tests

Run the backend smoke tests with:

```bash
node scripts/smoke-test.js
```

The smoke test starts the server on port `3100`, runs in mock mode, checks the most important backend responses, and stops the server when it is done.

## Automatic Smoke Tests

GitHub runs the smoke test automatically on pull requests and pushes to `main`.

This helps catch broken origin checks, topic gate behavior, and validation before merging. The workflow runs in mock mode only and does not test real OpenAI mode.

## Deployment Readiness

The app now has basic endpoints that hosting platforms can use during a private staging deployment:

- `GET /health` returns whether the server is running and whether it is in `mock` or `openai` mode.
- `GET /ready` checks whether tenant config files can be loaded and returns the number of tenants found.

The server reads `PORT` from the environment, which most hosting providers set automatically. `OPENAI_API_KEY` is still optional. Without it, the app runs in mock mode. With it, the backend can call OpenAI, but the browser still never receives the key.

This is still meant for staging and private demos, not public production. Before production, the project still needs stronger rate limiting, monitoring, security review, privacy review, and approved municipal knowledge sources.

See `docs/deployment.md` for the deployment notes.

## Future FXW/server Deployment

The repo now also has notes for a future traditional Linux server deployment, such as an FXW VPS or managed Linux server with SSH access.

Read:

```text
docs/fxw-server-deployment.md
```

Before a staging deployment, check tenant config with:

```bash
node scripts/check-deployment-config.js
```

This checks that tenant JSON files have the required deployment fields, warns about localhost-only origins, and warns about `example.com` contact or privacy links. It does not deploy anything and does not require `OPENAI_API_KEY`.

## FXW Staging Deployment Preparation

The repo includes practical files for a future FXW/Linux staging deployment:

- `ops/fxw/example-env-file.env`
- `ops/fxw/gemeente-ai-assistent.service.example`
- `ops/fxw/nginx-site.conf.example`
- `docs/fxw-staging-runbook.md`
- `scripts/check-hosted-deployment.js`

After a hosted staging deployment is reachable, run:

```bash
BASE_URL=https://assistant.example.nl node scripts/check-hosted-deployment.js
```

This checks `/health`, `/ready`, staging config, staging chat, and blocked origins. It does not require `OPENAI_API_KEY`.

## Staging Embed Simulation

`demo/staging-embed.html` simulates the future hosted snippet for an FXW/server deployment.

In production, the widget script and API base will point to the FXW-hosted domain, for example `https://assistant.example.nl`. The current local version uses localhost only and keeps `data-api-base=""` so the widget calls the same local demo server.

No API key is exposed in the snippet. The browser still only receives public tenant configuration and sends chat messages to this backend.

## Project Structure

```text
gemeente-ai-assistent/
  README.md
  AGENTS.md
  .env.example
  .github/
    workflows/
      smoke-test.yml
  templates/
    knowledge.template.json
    tenant.template.json
  ops/
    fxw/
      example-env-file.env
      gemeente-ai-assistent.service.example
      nginx-site.conf.example
  apps/
    server/
      server.js
      knowledge/
        demo.json
        staging.json
        waterstad.json
      tenants/
        demo.json
        staging.json
        waterstad.json
  docs/
    ai-transparency-note.md
    architecture.md
    deployment.md
    dpia-input-notes.md
    fxw-server-deployment.md
    fxw-staging-runbook.md
    manual-test-checklist.md
    municipality-integration-guide.md
    pilot-intake-form.md
    privacy.md
    privacy-security-review-pack.md
    mvp.md
    pilot-checklist.md
    risk-register.md
    source-review-process.md
    tenant-onboarding.md
  demo/
    demo.html
    embed-snippet.html
    staging-embed.html
    waterstad.html
  scripts/
    check-deployment-config.js
    check-hosted-deployment.js
    create-tenant.js
    smoke-test.js
  widget/
    widget.js
```

## Current Status

This is a mock-first chat assistant with optional server-side OpenAI support. It is meant to feel like a real assistant while keeping the backend safe and simple.
