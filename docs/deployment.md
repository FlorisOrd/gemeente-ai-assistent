# Deployment Notes

This app is not production-ready yet, but it is ready for a first private staging deployment.

Use staging only with test tenants, reviewed allowed origins, and no real citizen data.

## Environment Variables

- `PORT`: the port for the web server. Hosting providers usually set this automatically.
- `OPENAI_API_KEY`: optional. If it is missing, the server runs in mock mode. If it is present, the server can call OpenAI from the backend.

Never commit API keys. Do not put keys in browser files, tenant config, README examples, or demo pages.

## Tenant Origins

Production tenant configs must list only real municipality website origins in `allowedOrigins`.

For example:

```json
[
  "https://www.gemeente-demo.nl"
]
```

Localhost origins are useful for demos, but they should be reviewed before a real public deployment.

## Rate Limiting

The current rate limiter stores counters in server memory. That is fine for an MVP demo on one server instance, but it is not enough for production.

Later, replace it with production-grade rate limiting shared across server instances, for example at the hosting gateway or with a shared store.

## Logging

Logs must not contain citizen messages. Even a simple question can include personal data.

The server should log technical status and errors only. It must never print the OpenAI API key.

## Checks

- Health check path: `/health`
- Readiness check path: `/ready`

`/health` confirms the server is running and reports whether it is in `mock` or `openai` mode.

`/ready` confirms tenant JSON files can be loaded and reports how many tenant config files were found.
