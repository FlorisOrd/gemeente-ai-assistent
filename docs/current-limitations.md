# Current Limitations

This project is ready for a first private staging release candidate, but it is not production-ready yet.

## Not Production-Ready Yet

- No production-grade rate limiting. The current rate limiter is in-memory and only works for one server instance.
- No real municipality content pipeline. Approved knowledge files are simple JSON files for the MVP.
- No admin dashboard for managing tenants, origins, sources, or wording.
- No formal DPIA/GEB, legal, privacy, or security signoff.
- No formal accessibility audit on a real municipality website.
- No monitoring dashboard, alerting, or log aggregation setup.
- No persistent feedback handling. Widget feedback is local-only and is not stored.
- No database.
- No authentication.
- No real production deployment yet.

## What This Means

Use `0.1.0-staging` only for private demos or staging pilots with reviewed tenants, reviewed approved sources, and clear expectations. Before public production, the project needs stronger operational, legal, privacy, security, accessibility, and content governance work.
