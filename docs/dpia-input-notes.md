# DPIA/GEB Input Notes

These notes are practical input for a future DPIA/GEB discussion. They are not a completed DPIA/GEB and not legal advice.

## Processing Purpose

Placeholder: help visitors find municipal information through an AI assistant on a municipality website.

The assistant should answer only from approved source summaries or direct visitors to official contact channels.

## Categories Of Data Expected

Expected data:

- Visitor chat message.
- Tenant id.
- Technical request metadata such as IP address, Origin header, user agent, timestamps, and proxy headers.
- In OpenAI mode, relevant approved source summaries and the visitor message may be sent to OpenAI from the backend.

## Categories Of Data Not Intended

The pilot should not intentionally process:

- BSN.
- Medical data.
- Financial details.
- Case numbers.
- Private citizen case details.
- Login or account data.
- Uploaded files.

## Data Flow Overview

1. Visitor opens a municipality website with the widget.
2. Browser loads `widget/widget.js`.
3. Widget requests public tenant config from `/api/config`.
4. Visitor sends a question to `/api/chat`.
5. Backend checks origin, validation, topic gate, rate limit, and approved knowledge.
6. If no approved source is found, backend returns `no-approved-source`.
7. In mock mode, backend returns a mock answer using matched approved sources.
8. In OpenAI mode, backend sends the message and relevant approved summaries to OpenAI and returns the answer.

## Processors/Subprocessors Placeholder

Placeholder to complete before pilot:

- Hosting provider:
- OpenAI or other AI provider:
- Monitoring/logging provider:
- Other subprocessors:

## Retention Placeholder

Placeholder to complete before pilot:

- Application chat storage: none in current MVP.
- Feedback storage: none in current MVP.
- Technical logs retention:
- Reverse proxy logs retention:
- Hosting provider logs retention:

## Security Measures Currently Implemented

- Server-side API key only.
- No API key in browser snippet.
- Origin allowlist per tenant.
- Input validation for empty and long messages.
- Large request-body protection.
- Basic in-memory rate limiting.
- Topic gate before OpenAI/mock responses.
- Approved knowledge matching before OpenAI/mock responses.
- `no-approved-source` response when no approved source is found.
- App avoids logging full citizen messages.
- Health and readiness endpoints expose no secrets.

## Security Measures Still Needed Before Production

- Production-grade shared rate limiting.
- Hosting and reverse proxy hardening.
- TLS/HTTPS configuration.
- Monitoring and alerting.
- Log retention policy.
- Incident response process.
- Source review ownership and review dates.
- Accessibility review on the real website.
- Formal privacy/security review.
- Deployment secrets management.

## Data Subject Considerations

- Visitors should be clearly told they are using an AI assistant.
- Visitors should be warned not to enter sensitive personal data.
- Visitors should have official contact routes for personal or urgent situations.
- The assistant should not make final decisions.
- Source links should be visible so visitors can verify information.

## Human Oversight

Before pilot:

- Municipality reviews allowed topics.
- Municipality reviews source summaries.
- Municipality approves transparency text.
- Municipality approves contact and privacy links.
- Privacy/security officer reviews pilot scope.

During pilot:

- Incorrect or incomplete answers should be reported and reviewed.
- Sources should be updated or removed when outdated.
- Pilot feedback should be handled without collecting unnecessary personal data.

## Pilot Scope Boundaries

Placeholder:

- Pilot tenant:
- Pilot website/domain:
- Pilot start date:
- Pilot end date:
- Public or private:
- OpenAI mode or mock mode:
- Topics in scope:
- Topics out of scope:
