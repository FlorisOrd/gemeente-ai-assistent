# Planned Architecture

This document describes the planned architecture for the embeddable municipality assistant.

The first version is intentionally small. It has a static widget script, a demo page, a tiny backend, optional server-side OpenAI support, and a demo tenant configuration. Later versions can add real content retrieval.

## Future Embed Flow

Municipalities should eventually add one script tag to their website:

```html
<script src="https://example.com/widget.js" data-tenant="demo"></script>
```

The `data-tenant` value tells the widget which municipality configuration to use.

## Main Parts

### 1. Municipality Website

The existing municipality website stays in control of the page.

The widget should:

- Load from a single script tag.
- Add a small floating button.
- Open a chat panel when the visitor clicks the button.
- Avoid interfering with the rest of the website.

### 2. Widget Script

The widget script is the browser code loaded by the municipality website.

It currently:

- Reads tenant settings.
- Sends visitor questions to the backend.
- Displays assistant answers and source links.

In the future it may show richer municipality branding and privacy information before sending a message.

### 3. Backend API

The backend is currently a very small server in `apps/server`.

It currently:

- Receives chat messages from the widget.
- Loads tenant-specific configuration.
- Returns a fake Dutch assistant answer when `OPENAI_API_KEY` is not set.
- Calls the OpenAI Responses API from the server when `OPENAI_API_KEY` is set.

The API key is never sent to the browser.

### 4. Tenant Configuration

Each municipality will need its own configuration.

Possible settings:

- Municipality name.
- Website URL.
- Theme color.
- Allowed content sources.
- Contact links.
- Privacy text.
- Language preferences.

### 5. AI and Search Layer

The AI layer should only answer from approved sources.

A future version may use:

- Municipality website pages.
- Policy documents.
- Frequently asked questions.
- Service pages.
- Contact information.

Answers should include links back to official municipality pages whenever possible.

## Planned Request Flow

1. Visitor opens a municipality website.
2. The website loads `widget.js`.
3. The widget reads `data-tenant`.
4. The visitor opens the chat panel.
5. The visitor asks a question.
6. The widget sends the question to the backend.
7. The backend loads the tenant configuration.
8. The backend returns either a mock Dutch answer or an OpenAI answer and source links.
9. The widget shows the response to the visitor.

## Current Version

The current version contains:

- Static documentation.
- A demo page.
- A browser widget that posts to `/api/chat`.
- A small backend server in `apps/server`.
- A demo tenant config in `apps/server/tenants/demo.json`.
- Optional server-side OpenAI support through `OPENAI_API_KEY`.

There is still no database, authentication, streaming, file search, or storage.
