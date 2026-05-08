# Gemeente AI Assistent

This project is the first version of an embeddable AI assistant widget for Dutch municipality websites.

The long-term idea is simple: a municipality can add one HTML snippet to its website, and visitors get a small assistant that can help them find municipal information.

Example of the future embed snippet:

```html
<script src="https://example.com/widget.js" data-tenant="demo"></script>
```

## What is included now

- A demo HTML page that shows how the widget could be embedded.
- A placeholder widget script that creates a floating chat button and panel.
- Documentation for the planned architecture, privacy principles, and MVP scope.

## What is not included yet

- No backend.
- No AI API calls.
- No real API keys.
- No build step.
- No Node, npm, Docker, or other local tools required.

## Try the demo

Open `demo/demo.html` in a browser.

The widget is loaded from the local `widget/widget.js` file. It only shows placeholder messages for now.

## Project Structure

```text
gemeente-ai-assistent/
  README.md
  AGENTS.md
  docs/
    architecture.md
    privacy.md
    mvp.md
  demo/
    demo.html
  widget/
    widget.js
```

## Current Status

This is an initial scaffold. It is meant to be easy to understand and safe to change.
