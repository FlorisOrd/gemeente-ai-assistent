# Gemeente AI Assistent

This project is the first working mock version of an embeddable AI assistant widget for Dutch municipality websites.

The long-term idea is simple: a municipality can add one HTML snippet to its website, and visitors get a small assistant that can help them find municipal information.

Example of the future embed snippet:

```html
<script src="https://example.com/widget.js" data-tenant="demo"></script>
```

## What is included now

- A demo HTML page that shows how the widget could be embedded.
- A widget script that creates a floating chat button and panel.
- A very small backend server with a `POST /api/chat` endpoint.
- Optional server-side OpenAI support when `OPENAI_API_KEY` is set.
- A simple tenant config for `demo`.
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

The flow is:

1. The demo page loads `widget/widget.js`.
2. The widget reads `data-tenant="demo"`.
3. The visitor types a message.
4. The widget sends the message to `POST /api/chat`.
5. The server loads `apps/server/tenants/demo.json`.
6. The server returns a fake Dutch assistant response.
7. The widget shows the response and mock source links.

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

## Project Structure

```text
gemeente-ai-assistent/
  README.md
  AGENTS.md
  .env.example
  apps/
    server/
      server.js
      tenants/
        demo.json
  docs/
    architecture.md
    privacy.md
    mvp.md
  demo/
    demo.html
  widget/
    widget.js
```

## Current Status

This is a mock-first chat assistant with optional server-side OpenAI support. It is meant to feel like a real assistant while keeping the backend safe and simple.
