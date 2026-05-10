# FXW Staging Runbook

This runbook prepares a future private staging deployment on an FXW VPS or managed Linux server. It does not deploy anything by itself.

The goal is to run the Node.js app on the server, put Nginx or Apache in front of it for HTTPS, and test the hosted widget safely.

## Prerequisites

- You have an FXW VPS or managed Linux server.
- You have SSH access to the server.
- Node.js is installed on the server.
- Git is available on the server, or the project files are uploaded another way.
- You know the staging domain, for example `assistant.example.nl`.

## 1. Clone Or Pull The Repo

On the server, choose a deployment directory. The examples use:

```bash
/var/www/gemeente-ai-assistent
```

Clone the repo there, or pull the latest version if it already exists:

```bash
cd /var/www/gemeente-ai-assistent
git pull
```

## 2. Create The Server-Only Environment File

Create a file on the server, for example:

```bash
/etc/gemeente-ai-assistent.env
```

Use `ops/fxw/example-env-file.env` as a guide.

Example mock-mode staging file:

```env
PORT=3000
```

Example real OpenAI mode:

```env
PORT=3000
OPENAI_API_KEY=replace_with_real_key_on_server_only
```

Never paste API keys into GitHub, README files, demo pages, tenant JSON files, or browser code.

If `OPENAI_API_KEY` is missing, the app runs in mock mode. If it is present on the server, the backend can call OpenAI.

## 3. Configure The systemd Service

Use this example:

```text
ops/fxw/gemeente-ai-assistent.service.example
```

Copy it to:

```bash
/etc/systemd/system/gemeente-ai-assistent.service
```

Then check the placeholders:

- `WorkingDirectory=/var/www/gemeente-ai-assistent`
- `EnvironmentFile=/etc/gemeente-ai-assistent.env`
- `ExecStart=/usr/bin/node apps/server/server.js`

Reload systemd and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable gemeente-ai-assistent
sudo systemctl start gemeente-ai-assistent
sudo systemctl status gemeente-ai-assistent
```

## 4. Configure The Reverse Proxy

Use this example:

```text
ops/fxw/nginx-site.conf.example
```

Copy it into the Nginx site configuration and replace `assistant.example.nl` with the real staging domain.

The reverse proxy should send traffic to:

```text
http://127.0.0.1:3000
```

Configure TLS/HTTPS certificates on the real server. The example file does not include certificate paths because those depend on the server setup.

## 5. Test Health And Readiness

Open these URLs in a browser or use curl:

```text
https://assistant.example.nl/health
https://assistant.example.nl/ready
```

`/health` should return `status: "ok"`.

`/ready` should return `status: "ready"` and a tenant count.

## 6. Test The Widget URL

Open:

```text
https://assistant.example.nl/widget/widget.js
```

It should return JavaScript, not an error page.

## 7. Test The Staging Embed Snippet

Use a staging website page that embeds:

```html
<script src="https://assistant.example.nl/widget/widget.js" data-tenant="staging" data-api-base="https://assistant.example.nl" async></script>
```

The widget should load and send API requests to the hosted assistant domain.

## 8. Test allowedOrigins

The staging website origin must be listed in:

```text
apps/server/tenants/staging.json
```

For example:

```json
"allowedOrigins": [
  "https://staging.example.com"
]
```

If the website origin is missing, `/api/config` and `/api/chat` should return `403`.

## 9. Run Checks

On your local machine or Codespaces:

```bash
node scripts/smoke-test.js
node scripts/check-deployment-config.js
```

After the hosted staging deployment is reachable, run:

```bash
BASE_URL=https://assistant.example.nl node scripts/check-hosted-deployment.js
```

This hosted check does not need `OPENAI_API_KEY`.

## 10. Checking Logs Safely

If the app runs with systemd, view logs with:

```bash
sudo journalctl -u gemeente-ai-assistent
```

To follow logs while testing:

```bash
sudo journalctl -u gemeente-ai-assistent -f
```

The app writes privacy-safe structured status logs. Search by request ID when the widget shows an `Ondersteuningscode`.

Never ask users to send BSN, medical data, financial details, case numbers, or other sensitive personal data for support.

Do not enable raw message logging. Logs should stay limited to technical fields such as request ID, tenant, status, timestamp, duration, masked IP, and Origin.

## 11. Rollback Plan

Keep the previous working version available.

If the new deployment fails:

1. Stop the service: `sudo systemctl stop gemeente-ai-assistent`
2. Restore the previous repo version or deployment folder.
3. Start the service again: `sudo systemctl start gemeente-ai-assistent`
4. Recheck `/health` and `/ready`.

## 12. Switching Modes

Mock mode:

- Remove `OPENAI_API_KEY` from `/etc/gemeente-ai-assistent.env`.
- Restart the service.

Real OpenAI mode:

- Add `OPENAI_API_KEY` to `/etc/gemeente-ai-assistent.env`.
- Restart the service.

Restart command:

```bash
sudo systemctl restart gemeente-ai-assistent
```

Never print or paste the real API key into logs, GitHub, docs, or browser code.
