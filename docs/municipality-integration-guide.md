# Municipality Integration Guide

This guide is for a Dutch municipality website manager preparing a private pilot or staging test of the Gemeente AI Assistent.

## What The Assistant Is

The assistant is an embeddable AI chat widget for municipality websites. Visitors can ask simple questions and receive answers based on approved municipal source summaries.

The website adds the assistant with one script tag.

## What The Assistant Is Not

The assistant is not an official decision-maker. It does not replace the municipality website, the service desk, formal application forms, or legal decisions.

Visitors should always check official municipal links for final information.

## Embed Snippet Format

The general snippet format is:

```html
<script src="https://assistant.example.nl/widget/widget.js" data-tenant="TENANT_ID" data-api-base="https://assistant.example.nl" async></script>
```

Example staging snippet:

```html
<script src="https://assistant.example.nl/widget/widget.js" data-tenant="staging" data-api-base="https://assistant.example.nl" async></script>
```

## data-tenant

`data-tenant` tells the assistant which municipality configuration to use.

For example, `data-tenant="staging"` loads the public configuration, allowed origins, approved topics, and approved source setup for the staging tenant.

## data-api-base

`data-api-base` tells the widget where the backend API is hosted.

For a future FXW/server deployment, this will be the hosted assistant domain, such as:

```text
https://assistant.example.nl
```

For local demos, this can be empty so the widget calls the same local server.

## No API Keys In The Snippet

The OpenAI API key is never placed in the snippet. It must only be stored on the server.

Website visitors and browser developer tools should never see API keys.

## Allowed Website Domains

The municipality website domain must be listed in the tenant `allowedOrigins`.

For example, if the real website is:

```text
https://www.gemeente-waterstad.nl
```

then that exact origin must be included in the tenant configuration before the widget can be used from that website.

## Approved Sources

Answers are based on approved source summaries configured on the server.

If no approved source matches a question, the assistant should say that no approved information is available yet instead of guessing.

## Official Decisions

The assistant does not make official decisions and does not submit applications. It helps visitors find information and links.

For personal, urgent, or legal situations, visitors should use the official contact channels.

## Privacy

Visitors should not enter BSN, medical data, financial details, or other sensitive personal data into the assistant.

The widget also shows a privacy warning before visitors send a message.

## Accessibility

The widget uses real buttons and labels, but it should still be reviewed on the actual municipality website.

Check keyboard navigation, screen reader behavior, focus order, color contrast, and whether the widget conflicts with existing website components.

## Basic Go-Live Checklist

- [ ] Confirm the correct tenant id.
- [ ] Confirm the real website origin is listed in `allowedOrigins`.
- [ ] Confirm the contact link and privacy link are correct.
- [ ] Confirm approved source summaries and source links are reviewed.
- [ ] Confirm off-topic questions are rejected.
- [ ] Confirm unsupported municipal questions do not get guessed answers.
- [ ] Confirm no API key appears in browser files, page source, or developer tools.
- [ ] Confirm `/health` and `/ready` work on the hosted domain.
- [ ] Confirm the municipality has approved the wording, sources, and privacy notice.
- [ ] Confirm the pilot is private or staging, not public production.
