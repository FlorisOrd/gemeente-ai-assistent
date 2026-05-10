# Risk Register

This is a starter risk register for municipality pilots. Review and update it with the municipality before a pilot starts.

| Risk | Example | Current mitigation | Remaining risk | Recommended next step | Owner |
| --- | --- | --- | --- | --- | --- |
| Visitor enters personal data | A visitor types a BSN or medical detail into chat. | Widget privacy warning; prompt says not to process sensitive personal data; no database. | The backend still receives the message. | Review wording, logging, and incident handling with privacy officer. | Municipality / project owner |
| Assistant gives incomplete or wrong answer | The answer misses a condition for a permit. | Approved source summaries; source links; disclaimer; no final decisions. | Summaries may be incomplete or outdated. | Municipality reviews test answers and source summaries. | Content owner |
| Assistant answers outside approved scope | A visitor asks for non-municipal advice. | Topic gate and off-topic response. | Keyword matching is not perfect. | Add stronger policy layer before production. | Technical owner |
| No approved source exists | A valid municipal question has no matching source. | `no-approved-source` response and contact link. | Visitor may still need help. | Add missing approved sources or clarify contact path. | Content owner |
| Random website tries to use the tenant | Another website embeds the tenant id. | Origin allowlist blocks unapproved origins. | Misconfigured origins can block valid sites or allow wrong sites. | Review `allowedOrigins` before deployment. | Technical owner |
| OpenAI API key leaks | Key is accidentally added to a file or snippet. | Key is server-side only; `.env` ignored; docs warn not to commit keys. | Human error is still possible. | Use server secrets management and review diffs. | Technical owner |
| High API usage/cost abuse | Automated traffic sends many chat messages. | Basic in-memory rate limit. | Not enough for serious public production. | Add gateway/proxy or shared production rate limiting. | Technical owner |
| Logs accidentally contain citizen messages | Reverse proxy logs request bodies or app logs raw messages. | App avoids logging full messages. | Hosting/proxy tools may log more than expected. | Review server and proxy logging configuration. | Hosting owner |
| Tenant config contains wrong domain | `allowedOrigins` lists the wrong website. | Config checker warns on placeholder/example domains. | A real but wrong domain may still pass. | Manual review by website manager. | Municipality / technical owner |
| Approved source content becomes outdated | A municipal page changes after summaries are written. | Sources are explicit and reviewable. | No automatic freshness check. | Add source owner and review date in future versions. | Content owner |
| Widget accessibility issue on host website | Widget conflicts with a menu or focus order. | Uses real buttons and labels. | Host website CSS/layout may affect experience. | Test on actual website with accessibility review. | Website manager |
| Production rate limiting is insufficient | One server instance is restarted and counters reset. | MVP in-memory limiter. | Abuse can still be possible. | Replace with production-grade shared rate limiting. | Technical owner |
| Municipality treats assistant answer as an official decision | Staff or visitors rely on answer as binding. | Disclaimer says assistant does not decide; source links shown. | Misunderstanding remains possible. | Approve transparency text and train pilot stakeholders. | Municipality |
