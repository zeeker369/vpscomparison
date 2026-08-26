# Historical Price Backfill

Daily VPSComparison observations live in `database/pricing/history/YYYY-MM-DD.json`.

Files in this directory contain reconstructed historical milestones from dated official sources. They are intentionally separate from direct daily observations.

Rules:
- Never claim continuous VPSComparison tracking before `tracking_started`.
- Never interpolate missing dates.
- Prefer official pricing pages, official changelogs, official product blogs, or official billing documentation.
- Store the source URL, source title, retrieval date, and confidence with every backfilled record.
- Render backfilled points differently from direct daily observations in future charts.
- A provider-level or family-level historical price is not automatically a plan-level historical price.
