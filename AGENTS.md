# AGENTS.md

Rules for future Codex work on this repository.

## Project Goal

Build an embeddable AI assistant widget for Dutch municipality websites.

The final product should let a municipality add one HTML snippet to its website:

```html
<script src="https://example.com/widget.js" data-tenant="demo"></script>
```

## Working Rules

- Keep the project beginner-friendly.
- Prefer plain HTML, CSS, and JavaScript until there is a clear need for more tooling.
- Do not add Node, npm, Docker, or a build system unless the user explicitly asks for it.
- Do not add a backend until the user explicitly asks for it.
- Do not add real API keys, tokens, passwords, or secrets.
- Do not commit generated dependency folders such as `node_modules/`.
- Keep documentation simple and practical.
- Use Dutch municipality context when writing examples.

## Privacy and Safety Rules

- Assume visitors may enter personal or sensitive information.
- Do not store user messages unless the user explicitly asks for a storage feature.
- Do not send data to third-party AI providers until privacy choices are documented.
- Do not log personal data in browser console output.
- Keep tenant configuration explicit and easy to review.

## Widget Rules

- The widget should be embeddable with one script tag.
- The widget should avoid changing the host website outside its own container.
- Use unique CSS class names or inline styles to avoid conflicts with municipality websites.
- Keep accessibility in mind: keyboard support, readable labels, and semantic controls.
- The placeholder widget must not pretend to answer real municipal questions yet.

## Pull Request Rules

- Keep PRs small and focused.
- Explain what changed in plain language.
- Include manual test steps when relevant.
- Mention privacy implications when a change touches user data.
