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
- [ ] Ask a municipality-related but unsupported question, such as `Hoe dien ik bezwaar in tegen de WOZ waarde?`, and confirm it returns `mode: "no-approved-source"`.
- [ ] Ask `Hoe bak ik een cake?` and confirm it is still rejected as off-topic.
- [ ] Confirm the browser does not receive secret prompts or API keys.
- [ ] Confirm OpenAI is not called when no approved source is found.

## Privacy Warning

- [ ] Open the chat panel.
- [ ] Confirm this notice is visible before sending a message: `Deel geen BSN, medische gegevens of andere gevoelige persoonsgegevens.`

## Widget Trust and Feedback

- [ ] Confirm the AI assistant disclaimer is visible.
- [ ] Confirm the privacy warning is visible.
- [ ] Ask a question with sources and confirm the `Gebruikte bron(nen):` label appears.
- [ ] Confirm a friendly mode label appears after answers.
- [ ] Click `Nuttig` and confirm it says `Bedankt voor uw feedback.`
- [ ] Click `Niet nuttig` and confirm it says `Bedankt voor uw feedback.`
- [ ] Click `Gesprek wissen` and confirm the intro message returns.
- [ ] Confirm keyboard navigation still works for opening, sending, feedback, and clearing.
- [ ] Open and close the widget and confirm the button does not shift horizontally.
- [ ] Test `hallo` and confirm it returns a friendly greeting.
- [ ] Test `Hoe dien ik bezwaar in tegen de WOZ waarde?` and confirm it returns a normal answer with a relevant source.
- [ ] Confirm neither `hallo` nor the WOZ question shows `Method not allowed`.

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
- [ ] Compare demo, waterstad, and staging visual variants.
- [ ] Check focus states on open, close, input, send, source links, feedback, and clear controls.
- [ ] Check source labels are easy to find.
- [ ] Check status labels are readable and not color-only.
- [ ] Check warning and disclaimer hierarchy.
- [ ] Check mobile or narrow viewport layout.
- [ ] Check the widget looks professional on the busy test page.
- [ ] Confirm bottom-right and bottom-left launchers stay visually anchored when opened and closed.
- [ ] Open `/demo/accessibility-test.html` and review keyboard and 200% zoom behavior.

## Tenant Configuration

- [ ] Confirm the widget title shows the `assistantName` from `apps/server/tenants/demo.json`.
- [ ] Confirm the widget theme color matches `themeColor` from `apps/server/tenants/demo.json`.
- [ ] Confirm the privacy link opens `privacyUrl` from `apps/server/tenants/demo.json`.
- [ ] Confirm the contact link opens `contactUrl` from `apps/server/tenants/demo.json`.
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
- [ ] Confirm the privacy and contact links are shown.
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
