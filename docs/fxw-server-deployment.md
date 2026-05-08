# FXW Server Deployment Notes

This guide is for a future private staging or demo deployment on an FXW VPS or managed Linux server with SSH access.

It is not final production certification. Before a serious public launch, the app still needs a security review, privacy review, production monitoring, stronger rate limiting, and approved municipal knowledge sources.

## Basic Setup

The app should run with Node.js on the server. It uses only built-in Node.js features and does not need npm packages.

The server process listens on `PORT`. Many hosting setups set this automatically, but on a traditional VPS it may be configured in the service manager.

A reverse proxy such as Nginx or Apache should sit in front of the Node.js app. The reverse proxy should handle HTTPS and forward requests to the local Node.js process.

Example public widget URL:

```text
https://assistant.example.nl/widget/widget.js
```

Example municipality embed snippet:

```html
<script src="https://assistant.example.nl/widget/widget.js" data-tenant="waterstad" data-api-base="https://assistant.example.nl"></script>
```

Staging embed snippet example:

```html
<script
  src="https://assistant.example.nl/widget/widget.js"
  data-tenant="staging"
  data-api-base="https://assistant.example.nl"
  async>
</script>
```

The local demo version of this setup is `demo/staging-embed.html`. It uses the same tenant shape, but loads `/widget/widget.js` from localhost.

## Secrets

`OPENAI_API_KEY` must be stored only on the server. Never put it in GitHub, tenant JSON files, browser files, demo pages, or README examples.

If `OPENAI_API_KEY` is missing, the app runs in mock mode. This is useful for staging checks and private demos.

## Checks

Use these endpoints from the server, reverse proxy, or uptime monitor:

- `/health`: confirms the app is running and reports `mock` or `openai` mode.
- `/ready`: confirms tenant JSON files can be loaded.

Neither endpoint should expose secrets.

## Tenant Origins

Each tenant must list the real municipality website domains in `allowedOrigins`.

For a real municipality tenant, do not leave localhost-only origins in place. Localhost is useful during development, but production-like tenants should include the actual website origins that may embed the widget.

Example:

```json
[
  "https://www.gemeente-waterstad.nl"
]
```

## Rate Limiting

The current in-memory rate limiter is suitable for an MVP demo on one server process. It is not enough for serious public production traffic.

Later, replace it with production-grade rate limiting at the reverse proxy, hosting gateway, or a shared store.

## Logging

Logs must not contain citizen messages. Even simple questions can include personal data.

The server should log only technical status, safe errors, mode, and health information. It must never print API keys.

## Before Staging

Before a staging deployment, run:

```bash
node scripts/check-deployment-config.js
node scripts/smoke-test.js
```

The deployment config check does not deploy anything and does not need `OPENAI_API_KEY`.
