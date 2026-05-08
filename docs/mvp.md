# MVP Checklist

This checklist describes the first useful version of the municipality assistant.

## Current Version

- [x] Add project README.
- [x] Add future Codex working rules.
- [x] Add architecture notes.
- [x] Add privacy principles.
- [x] Add MVP checklist.
- [x] Add demo HTML page.
- [x] Add widget script.
- [x] Add a small mock backend API.
- [x] Add a simple demo tenant configuration.
- [x] Add optional server-side OpenAI support.
- [x] Add basic input validation and rate limiting.
- [x] Avoid real API keys.
- [x] Avoid npm, Docker, database, and authentication requirements.

## MVP 1: Static Widget

- [x] Load widget from one script tag.
- [x] Read `data-tenant` from the script tag.
- [x] Show a floating chat button.
- [x] Open and close a chat panel.
- [x] Show a mock assistant response.
- [ ] Work on desktop and mobile.
- [ ] Avoid conflicts with host website styling.
- [ ] Include basic keyboard accessibility.

## MVP 2: Tenant Configuration

- [x] Define a simple tenant configuration format.
- [x] Support municipality name.
- [x] Support theme color.
- [ ] Support contact link.
- [ ] Support privacy link.
- [ ] Keep demo tenant configuration fake.

## MVP 3: Backend Prototype

- [x] Add a small backend API.
- [x] Add a safe demo endpoint.
- [x] Do not store messages by default.
- [ ] Add rate limiting.
- [x] Add clear error messages.
- [x] Document privacy choices.

## MVP 4: AI Prototype

- [x] Connect to an AI provider without exposing API keys in the browser.
- [ ] Use only approved demo content.
- [ ] Return source links.
- [ ] Add a fallback when the assistant is unsure.
- [x] Add safety text for official information.

## MVP 5: Municipality Pilot

- [ ] Choose one demo municipality tenant.
- [ ] Review content sources.
- [ ] Review privacy documentation.
- [ ] Review accessibility.
- [ ] Test on a real municipality page template.
- [ ] Collect feedback from municipality staff.
