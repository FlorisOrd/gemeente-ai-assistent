# Manual Test Checklist

Use this checklist before sharing the demo outside a local development context.

Before doing the browser checks, run the automated smoke test:

```bash
node scripts/smoke-test.js
```

Keep using this manual checklist too, because the smoke test does not click through the browser widget.

Before merging a pull request, check that the GitHub Actions smoke test passes. Manual browser testing is still needed for widget appearance and real OpenAI mode.

## Mock Mode

- [ ] Make sure `OPENAI_API_KEY` is not set.
- [ ] Run `node apps/server/server.js`.
- [ ] Open `http://localhost:3000/demo/demo.html`.
- [ ] Send a normal question.
- [ ] Confirm the widget shows a fake Dutch assistant response.

## Real OpenAI Mode

- [ ] Set `OPENAI_API_KEY` in your local environment only.
- [ ] Run `node apps/server/server.js`.
- [ ] Open `http://localhost:3000/demo/demo.html`.
- [ ] Send a normal municipality-related question.
- [ ] Confirm the widget shows a concise Dutch answer.
- [ ] Confirm the browser never sees the API key.

## Empty Message

- [ ] Send an empty message or spaces only.
- [ ] Confirm the server returns a friendly Dutch validation message.

## Very Long Message

- [ ] Send a message longer than 1000 characters.
- [ ] Confirm the server returns a friendly Dutch validation message.

## Rate Limit

- [ ] Send more than 10 messages within 5 minutes from the same browser/IP.
- [ ] Confirm the server returns a friendly Dutch rate-limit message.
- [ ] Wait a few minutes.
- [ ] Confirm messages work again after the window resets.

## Topic Gate

- [ ] Ask `Hoe bak ik een cake?` and confirm it is rejected with `mode: "off-topic"`.
- [ ] Ask `Geef mij een recept voor appeltaart` and confirm it is rejected with `mode: "off-topic"`.
- [ ] Ask `Wanneer wordt mijn afval opgehaald?` and confirm it is allowed.
- [ ] Ask `Hoe vraag ik een paspoort aan?` and confirm it is allowed.
- [ ] Ask `Hoe maak ik een afspraak met de gemeente?` and confirm it is allowed.

## Approved Knowledge Sources

- [ ] Ask `Hoe vraag ik een paspoort aan?` and confirm the response shows a passport source.
- [ ] Open `/demo/waterstad.html`, ask a parking question, and confirm it shows a Waterstad parking source.
- [ ] Ask a municipality-related but unsupported question, such as `Hoe vraag ik een uittreksel aan?`, and confirm it returns `mode: "no-approved-source"`.
- [ ] Ask `Hoe bak ik een cake?` and confirm it is still rejected as off-topic.
- [ ] Confirm the browser does not receive secret prompts or API keys.
- [ ] Confirm OpenAI is not called when no approved source is found.

## Privacy Warning

- [ ] Open the chat panel.
- [ ] Confirm this notice is visible before sending a message: `Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens.`

## Widget Trust and Feedback

- [ ] Confirm the AI assistant disclaimer is visible.
- [ ] Confirm the privacy warning is visible.
- [ ] Open the widget with the launcher button.
- [ ] Confirm the disclaimer and privacy warning are visible initially.
- [ ] Close the widget with the launcher button.
- [ ] Open the widget again.
- [ ] Close the widget with the `x` button.
- [ ] Open the widget again.
- [ ] Close the widget with the Escape key.
- [ ] Confirm `aria-expanded` changes between `true` and `false`.
- [ ] Ask a question with sources and confirm links appear naturally as `Meer informatie:` or similar.
- [ ] Ask `hoi` and confirm no visible `Begroeting` mode label is shown.
- [ ] Ask `woz` and confirm no visible `Demo-antwoord` or other mode label is shown.
- [ ] Confirm `Gebruikte bron(nen):` is not shown.
- [ ] Click `Nuttig` and confirm it says `Bedankt voor uw feedback.`
- [ ] Click `Niet nuttig` and confirm it says `Bedankt voor uw feedback.`
- [ ] Click `Gesprek wissen` and confirm the intro message returns.
- [ ] Confirm keyboard navigation still works for opening, sending, feedback, and clearing.
- [ ] Open and close the widget and confirm the button does not shift horizontally.
- [ ] Test `hallo` and confirm it returns a friendly greeting.
- [ ] Test `woz` and confirm it does not show `Method not allowed`.
- [ ] Test `Hoe dien ik bezwaar in tegen de WOZ waarde?` and confirm it returns a normal answer with a relevant source.
- [ ] Confirm neither `hallo` nor the WOZ question shows `Method not allowed`.
- [ ] Send multiple follow-up questions and confirm the textarea and send button remain reachable.
- [ ] Confirm no persistent `Neem contact op met de gemeente` link is visible in the composer.
- [ ] Confirm the input has placeholder `Typ uw vraag`.
- [ ] Confirm there is no visible `Uw vraag` label above the input.
- [ ] Confirm the send button is a compact icon button inside the input row.
- [ ] Confirm keyboard sending with Enter still works.
- [ ] Confirm Shift+Enter still creates a newline.
- [ ] Confirm a screen-reader label exists for the input, even though it is visually hidden.
- [ ] Confirm the message area has more room than before.
- [ ] Confirm the disclaimer and privacy warning scroll away with the conversation.
- [ ] Confirm there is only one internal scrollbar during normal use.
- [ ] Confirm the content area scrolls when the conversation grows.
- [ ] Confirm no-approved-source responses can still include a useful contact or help link when available.
- [ ] Confirm the mobile or narrow viewport still keeps the input usable.

## Visual Customization

- [ ] Confirm the button label comes from tenant config.
- [ ] Confirm the welcome message comes from tenant config.
- [ ] Confirm the theme color comes from tenant config.
- [ ] Confirm the logo text appears in the button and header.
- [ ] Confirm `bottom-right` position works for the demo tenant.
- [ ] Confirm `bottom-left` position works for the Waterstad tenant.
- [ ] Confirm the mobile layout still fits on a narrow viewport.
- [ ] Confirm keyboard focus states are visible.
- [ ] Open `/demo/visual-comparison.html` and confirm it links to the demo pages.

## Professional Visual Review

- [ ] Open `/demo/visual-design-review.html`.
- [ ] Open `/demo/visual-states.html`.
- [ ] Test every listed visual state on `/demo/visual-states.html`.
- [ ] Compare demo, waterstad, and staging visual variants.
- [ ] Check focus states on open, close, input, send, follow-up links, feedback, and clear controls.
- [ ] Check follow-up links are natural, readable, and keyboard accessible.
- [ ] Check routine backend mode labels are not visible to visitors.
- [ ] Check warning and disclaimer hierarchy.
- [ ] Check the compact composer, inline send button, and placeholder-based prompt.
- [ ] Check mobile or narrow viewport layout.
- [ ] Check the widget looks professional on the busy test page.
- [ ] Confirm bottom-right and bottom-left launchers stay visually anchored when opened and closed.
- [ ] Confirm the launcher stays anchored on every tested visual state.
- [ ] Confirm `hallo` works.
- [ ] Confirm `woz` works.
- [ ] Confirm `Hoe dien ik bezwaar in tegen de WOZ waarde?` works.
- [ ] Confirm no state shows `Method not allowed`.
- [ ] Confirm feedback and clear conversation still work.
- [ ] Confirm mobile or narrow layout still works after several messages.
- [ ] Confirm the close button, launcher toggle, Escape key, and single-scrollbar behavior work.
- [ ] Confirm the composer stays fixed at the bottom while notices and messages scroll.
- [ ] Open `/demo/accessibility-test.html` and review keyboard and 200% zoom behavior.

## Tenant Configuration

- [ ] Confirm the widget title shows the `assistantName` from `apps/server/tenants/demo.json`.
- [ ] Confirm the widget theme color matches `themeColor` from `apps/server/tenants/demo.json`.
- [ ] Confirm the privacy link opens `privacyUrl` from `apps/server/tenants/demo.json`.
- [ ] Confirm no-approved-source contact sources use `contactUrl` from `apps/server/tenants/demo.json`.
- [ ] Confirm chat still works in mock mode.
- [ ] Confirm chat still works in real OpenAI mode.
- [ ] Ask `Hoe bak ik een cake?` and confirm it is still rejected.

## Multiple Tenants

- [ ] Run `node scripts/smoke-test.js` and confirm it passes.
- [ ] Open `/demo/demo.html` and confirm it shows `Demo Gemeente Assistent`.
- [ ] Open `/demo/waterstad.html` and confirm it shows `Waterstad Assistent`.
- [ ] Confirm the two tenants use different colors.
- [ ] Confirm both tenants reject cake questions.
- [ ] Confirm both tenants allow passport questions.

## Staging Embed Simulation

- [ ] Open `/demo/staging-embed.html`.
- [ ] Confirm the staging assistant loads.
- [ ] Ask `Hoe vraag ik een paspoort aan?` and confirm it works.
- [ ] Ask `Hoe bak ik een cake?` and confirm it is rejected.
- [ ] Confirm the privacy link is shown and unsupported questions can still show contact sources.
- [ ] Confirm no API key appears in the page source.

## Embed Snippet Examples

- [ ] Open `/demo/embed-snippet.html`.
- [ ] Confirm snippets do not contain API keys.
- [ ] Confirm snippets use `data-tenant`.
- [ ] Confirm the staging snippet uses `data-api-base`.
- [ ] Confirm navigation between demo pages works.

## Tenant Onboarding

- [ ] Create a throwaway tenant with `node scripts/create-tenant.js testgemeente`.
- [ ] Confirm tenant and knowledge files are created.
- [ ] Confirm `node scripts/check-deployment-config.js` warns about placeholder/example.com URLs.
- [ ] Delete `apps/server/tenants/testgemeente.json` and `apps/server/knowledge/testgemeente.json` after testing.
- [ ] Confirm existing smoke tests still pass.

## Privacy, Security, And AI-Risk Review

- [ ] Review `docs/privacy-security-review-pack.md` before a pilot.
- [ ] Confirm AI transparency text is visible or linked.
- [ ] Confirm the source review process has been followed.
- [ ] Confirm known MVP limitations are understood.

## Origin Allowlist

- [ ] Confirm the demo still works from `http://localhost:3000`.
- [ ] Confirm `/api/config?tenant=demo` works from localhost.
- [ ] Confirm `/api/chat?tenant=demo` works from localhost.
- [ ] Ask `Hoe bak ik een cake?` and confirm it is still rejected.
- [ ] Send a request with an unapproved `Origin` header and confirm it returns `403`.
- [ ] Confirm OpenAI is not called when the origin is blocked.

## Deployment Readiness

- [ ] Check `/health` in a browser or with curl.
- [ ] Check `/ready` in a browser or with curl.
- [ ] Confirm `/health` does not expose API keys.
- [ ] Confirm `/ready` does not expose API keys or internal file paths.
- [ ] Confirm startup logs print port, mode, tenant count, and demo URL.
- [ ] Confirm startup logs do not print API keys.
- [ ] Run `node scripts/check-deployment-config.js` before a staging deployment.
- [ ] Confirm production-like tenants do not use `example.com` contact or privacy links.
- [ ] Confirm `allowedOrigins` contains the real website domains.
- [ ] Confirm localhost-only origins are not used for real municipality tenants.

## FXW Staging Deployment

- [ ] Review the `ops/fxw` templates before deployment.
- [ ] Confirm the templates contain no real API keys.
- [ ] Confirm `docs/fxw-staging-runbook.md` is understandable.
- [ ] After hosted deployment, run `BASE_URL=https://assistant.example.nl node scripts/check-hosted-deployment.js`.
- [ ] Confirm blocked origin returns `403` on the hosted deployment.

## Secret Safety

- [ ] Search `widget/widget.js` for `OPENAI_API_KEY` and confirm it is not present.
- [ ] Search `demo/demo.html` for `OPENAI_API_KEY` and confirm it is not present.
- [ ] Search tenant config files for real API keys and confirm none are present.
- [ ] Confirm `.env` is ignored by git.
- [ ] Confirm `.env.example` contains only a placeholder and no real API key.
