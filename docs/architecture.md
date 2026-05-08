# Planned Architecture

This document describes the planned architecture for the embeddable municipality assistant.

The first version is intentionally small. It starts with a static widget script and a demo page. Later versions can add a backend, tenant configuration, and AI integrations.

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

In the future it may:

- Read tenant settings.
- Show the municipality name and colors.
- Send visitor questions to a backend.
- Display answers and source links.
- Show privacy information before sending a message.

For now, it only creates a placeholder chat button and panel.

### 3. Backend API

The backend does not exist yet.

When added later, it may:

- Receive chat messages from the widget.
- Apply tenant-specific configuration.
- Retrieve approved municipal content.
- Call an AI model.
- Return an answer with useful source links.

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
7. The backend finds relevant approved information.
8. The backend asks an AI model to draft an answer.
9. The backend returns the answer and source links.
10. The widget shows the response to the visitor.

## Current Version

The current scaffold only contains:

- Static documentation.
- A demo page.
- A placeholder browser widget.

There is no backend and no AI API call yet.
