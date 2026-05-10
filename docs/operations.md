# Operations

This note explains how to debug staging issues without logging citizen messages or sensitive personal data.

The project is still an MVP. A future production version needs proper monitoring, alerting, log retention rules, and operational ownership.

## Reading Logs On A Linux Server

If the app runs with systemd, start with:

```bash
sudo journalctl -u gemeente-ai-assistent
```

To follow new logs while testing:

```bash
sudo journalctl -u gemeente-ai-assistent -f
```

Some managed servers also show logs in a hosting dashboard. Use the same privacy rules there.

## Why Citizen Messages Are Not Logged

The server intentionally avoids logging full chat messages.

Even a normal-looking question can contain personal data, such as a BSN, medical detail, case number, address, or financial information. Logs are often copied into tickets or read by support people, so they should stay technical.

## Request IDs

Every `/api/chat` request receives a request ID.

The backend returns it in the `X-Request-Id` response header. For errors or support-relevant cases, the JSON response may also include `requestId`.

The request ID is random technical text. It does not contain the visitor message.

## Debugging A User Report

If a visitor reports a problem:

1. Ask for the support code if the widget showed one.
2. Ask for the approximate time.
3. Ask which municipality assistant or tenant was used.
4. Search logs by request ID first.
5. If there is no request ID, search by timestamp, tenant, status, and Origin.

Safe log fields include:

- `timestamp`
- `event`
- `requestId`
- `tenant`
- `mode`
- `statusCode`
- `durationMs`
- `maskedIp`
- `origin`
- `sourceCount`

These fields should usually be enough to see whether the issue was a blocked origin, validation error, rate limit, missing approved source, or temporary OpenAI failure.

## What Not To Log

Do not log:

- Full citizen messages.
- BSN or other sensitive personal data.
- OpenAI API keys.
- Prompts.
- Approved source summaries.
- Raw OpenAI responses.
- Full IP addresses unless a reviewed operational policy allows it.

Do not temporarily enable raw message logging during support. If more debugging data is needed, design a privacy-reviewed support flow first.

## Current MVP Limitations

The current logs are simple JSON lines written to stdout. This works for staging support on one server, but it is not a full monitoring setup.

Before public production, add proper monitoring, alerting, log retention rules, incident handling, and production-grade rate limiting.
