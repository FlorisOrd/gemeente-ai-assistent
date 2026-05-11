# Staging Release Checklist

Use this checklist before publishing a staging release candidate to an FXW/server environment.

## Automated Checks

- [ ] `node scripts/smoke-test.js` passes.
- [ ] `node scripts/check-deployment-config.js` passes, with only expected demo placeholder warnings.
- [ ] `scripts/check-hosted-deployment.js` is ready to run after deployment with `BASE_URL`.
- [ ] GitHub Actions checks are passing.

## Manual Checks

- [ ] Manual widget test is completed.
- [ ] Visual check is completed.
- [ ] Accessibility checklist is reviewed.
- [ ] `/health` shows the expected version.
- [ ] Version number in `VERSION` is checked.
- [ ] `VERSION` matches the latest `CHANGELOG.md` entry.
- [ ] GitHub release tag is created, for example `v0.1.0-staging`.
- [ ] Release notes are copied from `CHANGELOG.md`.
- [ ] Deployed version matches the `/health` version.
- [ ] FXW server checked out the release tag, not an arbitrary branch state.

## Content And Tenant Checks

- [ ] Tenant `allowedOrigins` values are reviewed.
- [ ] Approved knowledge sources are reviewed.
- [ ] Privacy and contact links are reviewed.
- [ ] No API keys or secrets are committed.

## Pilot Readiness Checks

- [ ] Privacy/security review pack is reviewed.
- [ ] FXW staging runbook is reviewed.
- [ ] Current limitations are understood.
- [ ] The staging deployment is still treated as a private pilot/demo, not public production.
