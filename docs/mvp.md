# MVP Checklist

This checklist describes the first useful version of the municipality assistant.

## Current Scaffold

- [x] Add project README.
- [x] Add future Codex working rules.
- [x] Add architecture notes.
- [x] Add privacy principles.
- [x] Add MVP checklist.
- [x] Add demo HTML page.
- [x] Add placeholder widget script.
- [x] Avoid backend code.
- [x] Avoid real API keys.
- [x] Avoid local tool requirements.

## MVP 1: Static Widget

- [ ] Load widget from one script tag.
- [ ] Read `data-tenant` from the script tag.
- [ ] Show a floating chat button.
- [ ] Open and close a chat panel.
- [ ] Show clear placeholder text.
- [ ] Work on desktop and mobile.
- [ ] Avoid conflicts with host website styling.
- [ ] Include basic keyboard accessibility.

## MVP 2: Tenant Configuration

- [ ] Define a simple tenant configuration format.
- [ ] Support municipality name.
- [ ] Support theme color.
- [ ] Support contact link.
- [ ] Support privacy link.
- [ ] Keep demo tenant configuration fake.

## MVP 3: Backend Prototype

- [ ] Add a small backend API.
- [ ] Add a safe demo endpoint.
- [ ] Do not store messages by default.
- [ ] Add rate limiting.
- [ ] Add clear error messages.
- [ ] Document privacy choices.

## MVP 4: AI Prototype

- [ ] Connect to an AI provider without exposing API keys in the browser.
- [ ] Use only approved demo content.
- [ ] Return source links.
- [ ] Add a fallback when the assistant is unsure.
- [ ] Add safety text for official information.

## MVP 5: Municipality Pilot

- [ ] Choose one demo municipality tenant.
- [ ] Review content sources.
- [ ] Review privacy documentation.
- [ ] Review accessibility.
- [ ] Test on a real municipality page template.
- [ ] Collect feedback from municipality staff.
