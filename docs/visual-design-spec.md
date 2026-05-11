# Widget Visual Design Specification

This is the MVP visual specification for the municipality AI assistant widget. It is inspired by Dutch public-sector accessibility expectations, WCAG 2.2 AA, and NL Design System principles.

This is not a formal accessibility audit. A real municipality pilot still needs human review on the actual host website.

## Design Principles

- Trustworthy: the widget should feel like a public service, not a sales chatbot.
- Calm: use restrained color, spacing, and motion.
- Accessible: readable text, visible focus, sufficient contrast, and real HTML controls.
- Clear: labels should explain actions and states in plain language.
- Municipality-neutral: the base design should work for many municipalities.
- Source-grounded: approved links and warnings must be easy to find without making the answer feel like a technical report.

## Layout Rules

- The widget is a fixed floating component that must not depend on host-site CSS.
- Supported positions are `bottom-right` and `bottom-left`.
- The panel should fit inside small screens with at least 12px viewport margin.
- The launcher must remain visually anchored when the panel opens and closes.
- For `bottom-right`, the launcher and panel align to the right edge.
- For `bottom-left`, the launcher and panel align to the left edge.
- The widget panel must remain usable when conversation history grows.
- The input area must remain reachable for follow-up questions.
- The composer should be compact so conversation content has priority.
- Persistent contact links should not consume composer space.
- Contact should be suggested contextually in assistant answers or follow-up links.
- The widget uses one scrollable content area containing notices and messages.
- The composer remains fixed at the bottom of the panel.
- Avoid double scrollbars; the body and messages list should not create competing scroll areas.
- The header contains a short logo text, assistant name, tenant label, and close button.
- The message list should scroll inside the panel before the full page layout breaks.
- Controls should follow a predictable order: messages, clear action, compact input row, status.

## Typography Rules

- Use system fonts only: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Main message text should be around 16px.
- Supporting text must not be smaller than 13px.
- Use line-height between 1.4 and 1.6.
- Avoid negative letter spacing.
- Avoid all-caps labels except short logo text.

## Color Rules

- Use CSS custom properties for color tokens.
- Tenant color may be used as the primary color only when contrast remains readable.
- Primary buttons and headers must have readable foreground text.
- Links must be visibly underlined or otherwise clearly recognizable as links.
- Warnings and error states may use color, but must also include text.
- Do not rely on color alone to communicate errors, warnings, or status.

## Spacing Scale

Use a compact 4px-based scale:

- `--gaa-space-1`: 4px
- `--gaa-space-2`: 8px
- `--gaa-space-3`: 12px
- `--gaa-space-4`: 16px
- `--gaa-space-5`: 20px
- `--gaa-space-6`: 24px

## Border-Radius Rules

- Use small, consistent radii.
- Standard controls use `--gaa-radius-md`.
- Panel and message bubbles use `--gaa-radius-lg`.
- Circular logo/avatar elements may use `50%`.
- Avoid overly rounded card-like layouts except the floating action button.

## Shadow And Elevation Rules

- Use one restrained panel shadow.
- Use a lighter button shadow.
- Shadows should support separation from busy websites, not create a flashy effect.
- Avoid glow, bokeh, gradient, or decorative effects.

## Button Rules

- Buttons must be real `<button>` elements.
- Buttons need visible text labels.
- Icon-only buttons are not allowed unless an accessible label is present and the icon meaning is obvious.
- The send action may be an inline icon button when it has an accessible label.
- Primary actions should be visually clear but calm.
- Target size should be at least 24px by 24px, preferably around 40px or larger.

## Message Bubble Rules

- User and assistant messages must be visually distinct.
- Message text should remain readable at 16px.
- Assistant messages should feel neutral and service-oriented.
- User messages may use the primary color if foreground contrast is sufficient.
- Do not make chat bubbles look playful or social-media-like.

## Source-Link Rules

- Links should appear as contextual follow-up actions, not as a standard citation box.
- Use natural labels such as `Meer informatie:` or `Lees meer:`.
- For contact-oriented fallback answers, use a natural label such as `Meer hulp:`.
- Follow-up links should be underlined and have enough spacing for touch use.
- Follow-up links should use official or approved URLs.
- Do not hide links behind icons or vague labels.

## Error And Status Message Rules

- Backend modes such as `mock`, `greeting`, `off-topic`, and `no-approved-source` are internal metadata and should not appear as routine visitor-facing labels.
- Support codes should only appear for support-relevant responses.
- Loading text should be calm and clear.
- Errors should be friendly and should not expose raw technical details.

## Mobile Layout Rules

- The panel should fit within the viewport at narrow widths.
- Text must not overflow controls.
- Buttons and links should remain tappable.
- The floating button label may truncate if the viewport is very narrow.
- The widget must remain usable at 200% zoom.

## Focus-State Rules

- Focus states must be visible for keyboard users.
- Use a consistent high-contrast focus ring.
- Focus must appear on the open button, close button, textarea, send button, follow-up links, feedback buttons, and clear-conversation button.
- Do not remove default focus unless replacing it with a stronger visible state.
- Placeholder text may provide the visible prompt when a visually hidden label preserves accessibility.

## Accessibility Requirements

- Aim for WCAG 2.2 AA.
- Target at least 4.5:1 contrast for normal text.
- Use semantic buttons and links.
- Keep `aria-live` for messages.
- Keep labels for form fields.
- Avoid tiny text, low contrast, and color-only status.
- Review the widget on the real municipality website before a pilot.

## Tenant Customization Rules

Tenant JSON may control:

- `themeColor`
- `buttonLabel`
- `welcomeMessage`
- `position`
- `logoText`
- Contact and privacy URLs

Tenant customization should not override safety text, privacy warnings, follow-up link behavior, or focus behavior without review.

## Visual Acceptance Criteria

- The launcher does not move horizontally when the panel opens or closes.
- The panel feels stable, calm, and intentionally aligned.
- Body text is readable at normal size and at narrow viewport widths.
- Focus states are obvious for keyboard users.
- Source links are clear, visibly clickable, and easy to scan.
- Warnings are visible but not overwhelming.
- The mobile layout is usable and does not feel cramped.
- Demo, Waterstad, and staging variants still feel like one product family.

## What Not To Do

- No tiny text.
- No low contrast.
- No icon-only buttons without labels.
- No color-only meaning.
- No overly playful chatbot style.
- No external fonts.
- No external images.
- No external brand assets without review.
- No decorative gradients, glows, or startup-style chat effects.
