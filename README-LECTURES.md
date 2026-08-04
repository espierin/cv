# ORCID publications and lectures integration

Upload these files to the repository:

- `activities-manual.json`
- `activities.json`
- `scripts/fetch-orcid.mjs`
- `.github/workflows/update-orcid.yml`

The revised ORCID script now separates these ORCID work types from the publication browser:

- `conference-presentation`
- `conference-paper`
- `lecture-speech`

They are written to `activities.json` instead of `publications.json`.

`activities-manual.json` contains the curated starting dataset. It is merged with lecture-like ORCID works on each refresh. Overlap is merged using normalized title and date/year.

The website continues to read:

- `publications.json` for publications
- `activities.json` for Upcoming Activities and History
