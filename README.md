# Eric Spierings academic website v2

## What this version adds

- Full ORCID publication record
- Crossref metadata
- Europe PMC abstracts, PMID, PMCID and MeSH terms
- OpenAlex citation counts, annual citation history, topics and open-access data
- Rich in-page publication modal
- Search and filters for year, journal, type, authorship position and access
- Related publications
- Research insights and publication analytics
- Active navigation
- Dark mode
- Print / Save as PDF CV view
- Schema.org structured data
- Mobile and keyboard accessibility improvements

## Upload

Replace or add these files in the repository:

- `index.html`
- `publication-config.json`
- `scripts/fetch-orcid.mjs`
- `.github/workflows/update-orcid.yml`

Keep your current `publications.json`. It will be replaced by the workflow.

## Run

1. Open GitHub Actions.
2. Select **Refresh ORCID publications**.
3. Choose **Run workflow** on the `main` branch.
4. Wait until the refresh and Pages deployment are green.
5. Reload the website.

The scheduled run remains daily at 04:17 UTC, which is 06:17 during Dutch summer time and 05:17 during Dutch winter time.

## Notes

OpenAlex citation counts and h-index can differ from Google Scholar. The website labels these metrics explicitly as OpenAlex-derived.

Journal impact factors are not supplied by ORCID, Crossref, Europe PMC or OpenAlex. They remain curated in `publication-config.json`.
