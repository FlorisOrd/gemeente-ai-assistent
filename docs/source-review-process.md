# Source Review Process

Approved knowledge sources are the basis for assistant answers.

The assistant should not answer from unapproved content.

## Source Requirements

Each source should come from:

- Official municipality website content.
- Approved pilot content supplied by the municipality.

Do not use:

- Unreviewed draft text.
- Private documents.
- Citizen case data.
- Informal notes.
- Content copied from unrelated websites.

## Required Fields

Each source item needs:

- `id`: stable source id.
- `title`: source title shown to visitors.
- `url`: official or approved source URL.
- `keywords`: words used for MVP keyword matching.
- `summary`: approved summary used by the assistant.

## Summary Approval

Someone at the municipality must approve source summaries before a pilot.

Summaries should be:

- Clear.
- Factual.
- Short enough for review.
- Based on the linked source.
- Free of BSN, private data, or citizen case details.

## Future Metadata

Future versions should add:

- Source owner.
- Review date.
- Expiry or next review date.
- Content status.
- Last checked date.

## Updating Sources

If a source becomes outdated:

1. Remove it or update it.
2. Re-run `node scripts/check-deployment-config.js`.
3. Test common questions.
4. Ask the municipality to approve the updated summary.

## No Approved Source

If no approved source exists for a question, the assistant should return `no-approved-source` and direct the visitor to official contact channels.

It should not guess from unapproved content or general model knowledge.
