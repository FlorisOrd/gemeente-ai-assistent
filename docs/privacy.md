# Privacy Principles

This project is intended for Dutch municipality websites. Privacy, transparency, and data minimization should be part of the design from the beginning.

This document is not legal advice. It is a practical starting point for privacy-friendly product decisions.

## Core Principles

### 1. Collect as Little as Possible

Only collect data that is needed to answer the visitor's question.

Avoid collecting:

- Names.
- Citizen service numbers.
- Addresses.
- Phone numbers.
- Email addresses.
- Health, financial, or legal details.

### 2. Be Clear With Visitors

Visitors should understand:

- That they are using an AI assistant.
- What the assistant can and cannot do.
- Whether their question is sent to a backend or AI provider.
- Whether messages are stored.
- Where they can find official municipality information.

### 3. Do Not Store Chat Messages by Default

The safest default is no message storage.

If storage is added later, document:

- What is stored.
- Why it is stored.
- How long it is stored.
- Who can access it.
- How a visitor can request deletion.

### 4. Use Approved Sources

The assistant should answer using approved municipality sources.

It should not guess about:

- Legal rights.
- Benefits.
- Permits.
- Taxes.
- Personal cases.
- Emergency situations.

When unsure, it should link visitors to official pages or contact options.

### 5. Keep Tenants Separate

Each municipality tenant should have separate settings and content sources.

One municipality should not be able to access another municipality's configuration, data, or logs.

### 6. Avoid Personal Data in Logs

Logs are useful for debugging, but they can accidentally contain personal data.

Future logging should:

- Avoid storing full visitor messages by default.
- Remove or mask personal data where possible.
- Use short retention periods.
- Be accessible only to authorized people.

### 7. Respect GDPR and Dutch Public Sector Expectations

Future versions should be designed with GDPR in mind.

Before a real launch, municipalities should review:

- Processor agreements.
- Data processing records.
- DPIA needs.
- Hosting location.
- AI provider terms.
- Security measures.
- Accessibility requirements.

## Current Version

The current version:

- Uses mock responses when `OPENAI_API_KEY` is not set.
- Can call OpenAI from the server when `OPENAI_API_KEY` is set.
- Sends the typed message to the backend at `/api/chat`.
- Does not store messages.
- Does not use cookies.
- Does not include tracking.
- Uses a fake demo tenant configuration.
- Keeps the API key on the server and out of browser files.
