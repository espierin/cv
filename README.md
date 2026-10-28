# Eric Spierings website - phases 3 to 10

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


## Theme behavior

The light theme is the default. Dark mode is only activated after the visitor explicitly selects it; that choice is stored locally in the browser.


## Dark-theme revision

The dark theme has been revised for substantially stronger contrast and readability:

- lighter body and muted text;
- clearer card and section separation;
- higher-contrast controls and active states;
- readable modal metadata and abstracts;
- improved badges, filters, charts and contact cards;
- light mode remains the default unless a visitor explicitly selected dark mode earlier.

## Reviewed profile and publication types (28 October 2026)

The Career section contains the reviewed ORCID affiliations: six employment appointments, seven education and qualification records, and 33 professional activities. `profile-affiliations.json` stores the public reviewed snapshot. Update the snapshot and rendered Career section together when affiliations change.

The publication browser combines `publications` and verified `conferenceAbstracts` from `publications.json`. Its default is **Regular publications** with all regular works shown. Select **Abstract** to browse conference abstracts or **All types (including abstracts)** to combine both. Changing type resets the view to all works so the Key publications view cannot hide the abstracts. Search and the other filters apply to both types. Research metrics continue to use regular publications only.

The separate conference abstract list has been removed. Abstract provenance links are available in the shared details dialog. The curated registry preserves verified complete author lists during scheduled refreshes.

## Phone layout

`mobile.css` adapts the lower sections for phone screens. All publication filters and category buttons wrap within the screen, controls have larger touch targets, form text avoids iOS focus zoom, and details use dynamic viewport height and safe-area insets. Phone publication lists initially show eight results with a Show more button; search and filters still cover the complete dataset. Desktop lists remain complete. Changing filters resets the phone result limit.
