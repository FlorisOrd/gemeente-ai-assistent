# Release Process

This document explains the GitHub release and tag process for private staging deployments.

## Main Rule

Every staging deployment should use a GitHub release tag.

Do not deploy a random untagged commit. A staging server should run a known version that can be checked, discussed, and rolled back.

## Version Files

- `VERSION` contains the current release version.
- `CHANGELOG.md` describes what changed in that version.
- `docs/release-checklist.md` must be completed before creating the tag.

For the first staging release candidate, the version is:

```text
0.1.0-staging
```

## Before Tagging

Before creating a staging release tag:

- Confirm `VERSION` is correct.
- Confirm `CHANGELOG.md` has an entry for the same version.
- Complete `docs/release-checklist.md`.
- Confirm GitHub Actions are passing.
- Confirm no real API keys or secrets are committed.
- Confirm the release is still private staging, not production.

## Tag Format

Use this tag format:

```text
v0.1.0-staging
```

The tag includes a leading `v`. The `VERSION` file does not.

## GitHub Release Title

Use the same value as the tag:

```text
v0.1.0-staging
```

## Release Notes

Copy the release notes from the matching `CHANGELOG.md` entry.

The GitHub release notes should clearly say:

- This is a private staging release.
- This is not a production release.
- Current limitations still apply.

## FXW Server Deployment Note

On the FXW server, deploy from a known tag:

```bash
cd /var/www/gemeente-ai-assistent
git fetch --tags
git checkout v0.1.0-staging
```

Do not edit code directly on the server. Make changes in GitHub through pull requests, create a new tag, and deploy that tag.

Server-only environment variables still live outside GitHub, for example in:

```text
/etc/gemeente-ai-assistent.env
```

`OPENAI_API_KEY` must be stored only on the server. Never put it in GitHub, docs, demo pages, tenant config, widget code, or release notes.

## Rollback

If a staging release has a problem, check out the previous working tag on the server and restart the service.

Example:

```bash
cd /var/www/gemeente-ai-assistent
git fetch --tags
git checkout v0.0.9-staging
sudo systemctl restart gemeente-ai-assistent
```

Then recheck `/health`, `/ready`, and the hosted deployment checker.
