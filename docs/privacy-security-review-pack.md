# Privacy, Security, And AI-Risk Review Pack

This is a practical, non-legal review pack for a Dutch municipality pilot.

It is not legal advice. A municipality may need its own DPIA/GEB assessment, security review, procurement review, and AI governance review before a pilot or production deployment.

The pilot should avoid collecting BSN, medical data, financial details, case numbers, or other sensitive personal data.

## Purpose Of The Assistant

The assistant helps visitors find municipal information through a website chat widget.

It is intended to:

- Answer simple questions about approved municipal topics.
- Point visitors to official source links.
- Say when no approved information is available.
- Redirect personal, urgent, or legal situations to official contact channels.

It is not intended to make official decisions, process applications, or replace the municipality website.

## What Data The Browser Sends To The Backend

For a chat request, the browser sends:

- The tenant id, such as `staging`.
- The visitor's message.
- Normal HTTP request metadata, such as IP address, Origin header, user agent, and headers added by the browser or proxy.

The widget also requests public tenant configuration from `/api/config`.

## What Data The Backend Sends To OpenAI

Only when `OPENAI_API_KEY` is configured, the backend may send:

- The visitor's message.
- A system instruction prompt.
- Relevant approved source summaries.
- Tenant context such as assistant name, municipality name, contact URL, and privacy URL.

The browser never sends directly to OpenAI. The API key stays server-side.

## What Data Is Not Intentionally Collected

The MVP does not intentionally collect:

- BSN.
- Medical data.
- Financial details.
- Case numbers.
- Account data.
- Authentication data.
- Uploaded files.
- Feedback storage.
- Chat history in a database.

Visitors are warned not to enter sensitive personal data.

## Current Logging Approach

The server avoids logging full citizen messages.

The app uses request IDs and structured status logs so staging support can connect a user report to technical events without seeing the chat text.

Logs should contain only technical status, request ID, mode, tenant, duration, masked IP information, blocked origin status, and safe errors.

Future deployments should review server, reverse proxy, and hosting logs to make sure citizen messages are not accidentally logged.

## API Key Handling

`OPENAI_API_KEY` must be stored only on the server, for example in a server-only environment file.

It must not be committed to GitHub, placed in tenant files, shown in snippets, or exposed to the browser.

If `OPENAI_API_KEY` is missing, the app runs in mock mode.

## Approved Knowledge Source Approach

The MVP uses per-tenant approved knowledge JSON files.

The assistant should answer only when relevant approved source summaries are found. Source summaries should be reviewed by the municipality before a pilot.

The current approach is simple keyword matching, not a full search system.

## Topic Gate And Off-Topic Handling

The backend has a basic keyword-based topic gate.

Clearly off-topic questions, such as recipes or programming help, are rejected before OpenAI or mock answer generation.

This gate is useful for an MVP, but it is not perfect.

## No-Approved-Source Behavior

If a question is municipality-related but no approved source matches, the assistant returns `no-approved-source`.

It should not guess from general model knowledge.

## Rate Limiting

The app has a simple in-memory per-IP rate limiter.

This is suitable for a private MVP demo on one server process, but not enough for serious public production traffic.

## Origin Allowlist

Each tenant has `allowedOrigins`.

Only approved website origins should receive tenant config or chat responses. Production tenants should list only real municipality website domains.

## Human Review Requirement Before Pilot

Before a pilot, a human reviewer from the municipality should approve:

- Tenant configuration.
- Allowed origins.
- Contact and privacy URLs.
- Allowed topics.
- Approved source summaries.
- Widget wording and transparency text.
- Test answers for common questions.

## Known MVP Limitations

- No authentication.
- No database.
- No dashboard.
- No production-grade rate limiter.
- No full content management workflow.
- No vector search.
- No formal audit log.
- No automatic source freshness check.
- Keyword matching can miss relevant sources.
- The widget still needs accessibility review on the real host website.

## Recommended Pre-Pilot Decisions

- Is the pilot private or public?
- Which pages may embed the widget?
- Which topics are in scope?
- Which sources are approved?
- Who approves source summaries?
- Who reviews privacy and security?
- Is a DPIA/GEB needed?
- Is OpenAI mode allowed, or should the pilot stay in mock mode?
- How will incidents or incorrect answers be handled?
- How long should logs be retained?

## Questions For The Privacy/Security Officer

- Does this pilot require a DPIA/GEB?
- Is the planned data flow acceptable for a private pilot?
- Is OpenAI mode allowed for this pilot?
- Are the current logging rules sufficient?
- What should the retention period be for technical logs?
- Who is responsible for reviewing source content?
- What should happen if a visitor enters personal data?
- What contact path should be shown for urgent or personal cases?
- Are additional security headers, monitoring, or hosting controls required?
- What must be completed before public production use?
