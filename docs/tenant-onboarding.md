# Tenant Onboarding

Use this guide when adding a new municipality tenant for a future pilot.

The workflow creates starter files only. You must edit and review them before use.

## Create A Tenant

Run:

```bash
node scripts/create-tenant.js nieuwegemeente
```

The tenant id must use only lowercase letters, numbers, and hyphens.

This creates:

```text
apps/server/tenants/nieuwegemeente.json
apps/server/knowledge/nieuwegemeente.json
```

The script never creates or asks for API keys.

## Edit The Tenant File

Open:

```text
apps/server/tenants/nieuwegemeente.json
```

Edit these fields:

- `municipalityName`: the public municipality name.
- `assistantName`: the name shown in the widget.
- `themeColor`: a brand color in hex format, for example `#2563eb`.
- `contactUrl`: the official contact page.
- `privacyUrl`: the official privacy page.
- `allowedOrigins`: the exact website origins that may use this tenant.
- `allowedTopics`: the topics the assistant may discuss.
- `mockSources`: simple fallback links for mock mode.

## Choose allowedOrigins

Use exact origins, not full page URLs.

Good:

```text
https://www.gemeentevoorbeeld.nl
```

Not good:

```text
https://www.gemeentevoorbeeld.nl/contact
```

For a real pilot, do not leave only localhost or placeholder origins.

## Add Approved Knowledge Sources

Open:

```text
apps/server/knowledge/nieuwegemeente.json
```

Each approved source item needs:

- `id`
- `title`
- `url`
- `keywords`
- `summary`

Use only approved municipality pages and summaries. Keep summaries clear, factual, and reviewed.

## Test Locally

Run:

```bash
node scripts/check-deployment-config.js
node scripts/smoke-test.js
node apps/server/server.js
```

Then test the widget in a browser with the tenant id.

## Test A Hosted Deployment

After deploying to staging, run:

```bash
BASE_URL=https://assistant.example.nl node scripts/check-hosted-deployment.js
```

Make sure the tenant origin is listed in `allowedOrigins`.

## Municipality Review Before Pilot

Before a pilot, the municipality should review:

- Tenant name and assistant name.
- Contact and privacy links.
- Allowed topics.
- Approved source URLs.
- Approved source summaries.
- Widget disclaimer and privacy warning.
- Answers for common test questions.

## Do Not Include

Do not include:

- API keys.
- BSN examples.
- Medical, financial, or other sensitive personal data.
- Private citizen cases.
- Unapproved source pages.
- Draft content that has not been reviewed.
