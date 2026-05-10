# Pilot Checklist

Use this checklist before starting a private municipality pilot.

- [ ] Choose the pilot municipality or use the fake `staging` tenant.
- [ ] Confirm `allowedOrigins` contains the pilot website domain.
- [ ] Confirm `contactUrl` is correct.
- [ ] Confirm `privacyUrl` is correct.
- [ ] Confirm approved knowledge sources are present and reviewed.
- [ ] Confirm off-topic questions are rejected.
- [ ] Confirm unsupported municipality questions return `no-approved-source`.
- [ ] Confirm no API keys are visible in the browser.
- [ ] Confirm `/health` works.
- [ ] Confirm `/ready` works.
- [ ] Confirm `node scripts/smoke-test.js` passes.
- [ ] Confirm `node scripts/check-deployment-config.js` passes, allowing only expected staging warnings.
- [ ] Confirm the manual browser tests pass.
- [ ] Confirm the municipality approves the wording and sources.
- [ ] Confirm logs do not contain citizen messages.
- [ ] Confirm the pilot is private or staging, not public production.
