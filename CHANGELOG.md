# Changelog

## 0.1.0-staging

First staging release candidate for private demos and FXW/server staging preparation.

### Added

- Embeddable municipality assistant widget.
- Public tenant configuration loaded by the widget.
- Tenant-specific name, color, position, button label, welcome message, privacy link, contact link, allowed origins, allowed topics, and mock sources.
- Basic visual customization through tenant JSON files.
- Approved knowledge source JSON files with simple keyword matching.
- Server-side MVP topic gate for clear off-topic questions.
- Greeting handling for simple Dutch greetings.
- Origin allowlist protection per tenant.
- Mock mode by default, with optional server-side OpenAI Responses API support when `OPENAI_API_KEY` is set.
- Privacy, safety, and cost guardrails including input validation, concise output settings, in-memory rate limiting, and safer logging.
- Request IDs and privacy-safe structured operational logs.
- Backend smoke tests and GitHub Actions smoke-test workflow.
- Deployment config checker and hosted deployment checker.
- FXW/Linux staging deployment templates and runbook.
- Municipality integration guide, pilot checklist, tenant onboarding docs, and privacy/security review pack.
- Professional widget visual design pass with compact composer, one internal scroll area, visible focus states, and natural follow-up links.
- `/health` and `/ready` endpoints for staging checks.

### Current Limitations

- Not production-ready.
- No production-grade rate limiting.
- No real municipality content pipeline or admin dashboard.
- No database or authentication.
- No formal DPIA/GEB, legal signoff, security review, or accessibility audit.
- No monitoring dashboard.
- Feedback buttons are local-only and do not store feedback.
- No real production deployment yet.
